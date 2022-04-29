using Microsoft.EntityFrameworkCore;

namespace ChaggarCharts.Api.Models
{
    public partial class ChaggarChartsContext : DbContext
    {
        public ChaggarChartsContext(DbContextOptions<ChaggarChartsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Genre> Genres { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Song> Songs { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

            modelBuilder.Entity<Like>(entity =>
            {
                entity.HasKey(e => new { e.Songid, e.Userid })
                    .HasName("PK__likes__6F92C020AF780461");

                entity.ToTable("likes");

                entity.Property(e => e.Songid).HasColumnName("songid");

                entity.Property(e => e.Userid).HasColumnName("userid");

                entity.Property(e => e.Createdatetime)
                    .HasPrecision(3)
                    .HasColumnName("createdatetime")
                    .HasDefaultValueSql("(sysdatetime())");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Updatedatetime)
                    .HasPrecision(3)
                    .HasColumnName("updatedatetime");

                entity.HasOne(d => d.Song)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(d => d.Songid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_likes_songid");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(d => d.Userid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_likes_userid");
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

                entity.Property(e => e.Link)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("link");

                entity.Property(e => e.Rating)
                    .HasColumnType("decimal(4, 2)")
                    .HasColumnName("rating");

                entity.Property(e => e.Reviewerid).HasColumnName("reviewerid");

                entity.Property(e => e.Submitteddate)
                    .HasColumnType("date")
                    .HasColumnName("submitteddate");

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

                entity.HasOne(d => d.Reviewer)
                    .WithMany(p => p.SongReviewers)
                    .HasForeignKey(d => d.Reviewerid)
                    .HasConstraintName("FK_songs_reviewerid");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.SongUsers)
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
