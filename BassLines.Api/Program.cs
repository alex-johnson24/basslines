using System;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using AutoMapper;
using BassLines.Api.Hubs;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using BassLines.Api.Profiles;
using BassLines.Api.Repositories;
using BassLines.Api.Services;
using BassLines.Api.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Exceptions;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Host.UseSerilog((context, config) =>
{
    var environment = context.HostingEnvironment.EnvironmentName;
    config
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .Enrich.WithExceptionDetails()
        .WriteTo.File("./logs/basslines-.txt", rollingInterval: RollingInterval.Day)
        .WriteTo.Console()
        .WriteTo.Debug()
        .Enrich.WithProperty("Environment", environment)
        .ReadFrom.Configuration(context.Configuration);
});

// Auto Mapper Configurations
var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new BassLinesProfile());
});

IMapper mapper = mapperConfig.CreateMapper();

builder.Services.AddSingleton(mapper);

// Auth settings
builder.Services.AddOptions<AuthSettings>().Bind(builder.Configuration.GetSection("AuthSettings"));
builder.Services.AddOptions<SpotifySettings>().Bind(builder.Configuration.GetSection("SpotifySettings"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(cfg =>
    {
        cfg.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["access_token"];
                return Task.CompletedTask;
            }
        };
        cfg.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidIssuer = builder.Configuration["AuthSettings:validIssuer"],
            ValidAudience = builder.Configuration["AuthSettings:validAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AuthSettings:secretKey"]))
        };
    });

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("AdminUser", policy =>
    {
        policy.RequireClaim(ClaimTypes.Role, "Administrator");
    });
    opt.AddPolicy("Reviewer", policy =>
        policy.RequireAssertion(
            context =>
                context.User.HasClaim(claim => claim.Type == ClaimTypes.Role && claim.Value == "Administrator")
                || context.User.HasClaim(claim => claim.Type == ClaimTypes.Role && claim.Value == "Reviewer")
        )
    );
});

// CORS
builder.Services.AddCors(p => p.AddPolicy("appcors", builder =>
{
    builder
        .WithOrigins("https://localhost:9000", "https://dev.basslines.co", "https://app.basslines.co")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithExposedHeaders("spotify_auth");
}));

// Cache
if (builder.Environment.IsDevelopment() || string.IsNullOrEmpty(builder.Configuration["ConnectionStrings:RedisCacheUrl"]))
{
    builder.Services.AddMemoryCache();
    builder.Services.AddScoped<IReviewerRotationService, InMemoryReviewerRotationService>();
}
else
{
    builder.Services.AddStackExchangeRedisCache(options => { options.Configuration = builder.Configuration.GetConnectionString("RedisCacheUrl"); });
    builder.Services.AddScoped<IReviewerRotationService, RedisReviewerRotationService>();
}

// Register repositories and services
builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMetricsRepository, MetricsRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILikeRepository, LikeRepository>();
builder.Services.AddScoped<ILeaderboardService, LeaderboardService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<ISpotifyService, SpotifyService>();

builder.Services.AddSignalR();

builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BassLines", Version = "v1" });
});

builder.Services.AddDbContextFactory<BassLinesContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BassLinesDatabase"),
    o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

builder.Services.AddHttpClient("Spotify", c =>
{
    c.BaseAddress = new Uri("https://api.spotify.com/v1/");
    c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
});

builder.Services.AddHttpClient("SpotifyToken", c =>
{
    c.BaseAddress = new Uri("https://accounts.spotify.com/api/token");
    c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
        $"{builder.Configuration["SpotifySettings:clientId"]}:{builder.Configuration["SpotifySettings:clientSecret"]}".Base64Encode());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BassLines v1"));
}
else
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors("appcors");
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<SongHub>("api/songHub");
});

try
{
    Log.Information($"Starting {Assembly.GetExecutingAssembly().GetName().Name}");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, $"Failed to start {Assembly.GetExecutingAssembly().GetName().Name}");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
