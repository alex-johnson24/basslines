using System;
using BassLines.Api.Hubs;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using BassLines.Api.Interfaces;
using BassLines.Api.Models;
using BassLines.Api.Profiles;
using BassLines.Api.Repositories;
using BassLines.Api.Services;
using BassLines.Api.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net.Http.Headers;

namespace BassLines
{
    public class Startup
    {

        public IConfiguration Configuration { get; }
        private readonly IWebHostEnvironment _env;

        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
            _env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new BassLinesProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();

            services.AddOptions<AuthSettings>().Bind(Configuration.GetSection("AuthSettings"));
            
            services.AddOptions<SpotifySettings>().Bind(Configuration.GetSection("SpotifySettings"));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                        ValidIssuer = Configuration["AuthSettings:validIssuer"],
                        ValidAudience = Configuration["AuthSettings:validAudience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["AuthSettings:secretKey"]))
                    };
                });
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("AdminUser", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, "Administrator");
                });
            });

            if (_env.IsDevelopment())
            {
                services.AddMemoryCache();
                services.AddScoped<IReviewerRotationService, InMemoryReviewerRotationService>();
            }
            else
            {
                services.AddStackExchangeRedisCache(options => { options.Configuration = Configuration.GetConnectionString("RedisCacheUrl"); });
                services.AddScoped<IReviewerRotationService, RedisReviewerRotationService>();
            }

            services.AddSingleton(mapper);
            services.AddScoped<ISongRepository, SongRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMetricsRepository, MetricsRepository>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ILikeRepository, LikeRepository>();
            services.AddScoped<ILeaderboardService, LeaderboardService>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<ISpotifyService, SpotifyService>();

            services.AddSignalR();

            services.AddControllers()
                    .AddJsonOptions(x =>
                    {
                        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BassLines", Version = "v1" });
            });

            services.AddDbContextFactory<BassLinesContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("BassLinesDatabase"),
                o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

            services.AddHttpClient("Spotify", c => 
            {
                c.BaseAddress = new Uri("https://api.spotify.com/v1/");
                c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });
            
            services.AddHttpClient("SpotifyToken", c => 
            {
                c.BaseAddress = new Uri("https://accounts.spotify.com/api/token");
                c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", 
                    $"{Configuration["SpotifySettings:clientId"]}:{Configuration["SpotifySettings:clientSecret"]}".Base64Encode());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BassLines v1"));
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SongHub>("songHub");
            });

            app.Run(async (context) =>
            {
                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(Path.Combine(env.WebRootPath, "index.html"));
            });
        }
    }
}
