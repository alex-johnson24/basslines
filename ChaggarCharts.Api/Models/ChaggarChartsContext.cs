using Microsoft.EntityFrameworkCore;

#nullable disable

namespace ChaggarCharts.Api.Models
{
    public partial class ChaggarChartsContext : DbContext
    {
        public ChaggarChartsContext()
        {
        }

        public ChaggarChartsContext(DbContextOptions<ChaggarChartsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Genre> Genres { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Song> Songs { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.ToTable("genres");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Createdatetime)
                    .HasPrecision(3)
                    .HasColumnName("createdatetime")
                    .HasDefaultValueSql("(sysdatetime())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.Updatedatetime)
                    .HasPrecision(3)
                    .HasColumnName("updatedatetime");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Createdatetime)
                    .HasPrecision(3)
                    .HasColumnName("createdatetime")
                    .HasDefaultValueSql("(sysdatetime())");

                entity.Property(e => e.Flag).HasColumnName("flag");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.Updatedatetime)
                    .HasPrecision(3)
                    .HasColumnName("updatedatetime");
            });

            modelBuilder.Entity<Song>(entity =>
            {
                entity.ToTable("songs");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Artist)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("artist");

                entity.Property(e => e.Createdatetime)
                    .HasPrecision(3)
                    .HasColumnName("createdatetime")
                    .HasDefaultValueSql("(sysdatetime())");

                entity.Property(e => e.Genreid).HasColumnName("genreid");

                entity.Property(e => e.Rating).HasColumnName("rating");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("title");

                entity.Property(e => e.Updatedatetime)
                    .HasPrecision(3)
                    .HasColumnName("updatedatetime");

                entity.Property(e => e.Userid).HasColumnName("userid");

                entity.HasOne(d => d.Genre)
                    .WithMany(p => p.Songs)
                    .HasForeignKey(d => d.Genreid)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_songs_genreid");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Songs)
                    .HasForeignKey(d => d.Userid)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_songs_userid");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Createdatetime)
                    .HasPrecision(3)
                    .HasColumnName("createdatetime")
                    .HasDefaultValueSql("(sysdatetime())");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("firstname");

                entity.Property(e => e.Hpassword)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("hpassword");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("lastname");

                entity.Property(e => e.Roleid).HasColumnName("roleid");

                entity.Property(e => e.Salt)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("salt");

                entity.Property(e => e.Updatedatetime)
                    .HasPrecision(3)
                    .HasColumnName("updatedatetime");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("username");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.Roleid)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_users_roleid");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
