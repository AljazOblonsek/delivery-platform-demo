﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using delivery_service_api.Database;

#nullable disable

namespace delivery_service_api.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("delivery_service_api.Entities.CompanyEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("Id");

                    b.ToTable("companies");
                });

            modelBuilder.Entity("delivery_service_api.Entities.PackageEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CompanyId")
                        .HasColumnType("integer")
                        .HasColumnName("company_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("status");

                    b.Property<string>("Title")
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<string>("TrackNumber")
                        .HasColumnType("text")
                        .HasColumnName("track_number");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<int?>("WorkerId")
                        .HasColumnType("integer")
                        .HasColumnName("worker_id");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("TrackNumber")
                        .IsUnique();

                    b.HasIndex("WorkerId");

                    b.ToTable("packages");
                });

            modelBuilder.Entity("delivery_service_api.Entities.WorkerEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CompanyId")
                        .HasColumnType("integer")
                        .HasColumnName("company_id");

                    b.Property<string>("Email")
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("Firstname")
                        .HasColumnType("text")
                        .HasColumnName("firstname");

                    b.Property<string>("HashedPassword")
                        .HasColumnType("text")
                        .HasColumnName("hashed_password");

                    b.Property<string>("Lastname")
                        .HasColumnType("text")
                        .HasColumnName("lastname");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("workers");
                });

            modelBuilder.Entity("delivery_service_api.Entities.PackageEntity", b =>
                {
                    b.HasOne("delivery_service_api.Entities.CompanyEntity", "Company")
                        .WithMany("Packages")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("delivery_service_api.Entities.WorkerEntity", "Worker")
                        .WithMany("Packages")
                        .HasForeignKey("WorkerId");

                    b.Navigation("Company");

                    b.Navigation("Worker");
                });

            modelBuilder.Entity("delivery_service_api.Entities.WorkerEntity", b =>
                {
                    b.HasOne("delivery_service_api.Entities.CompanyEntity", "Company")
                        .WithMany("Workers")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("delivery_service_api.Entities.CompanyEntity", b =>
                {
                    b.Navigation("Packages");

                    b.Navigation("Workers");
                });

            modelBuilder.Entity("delivery_service_api.Entities.WorkerEntity", b =>
                {
                    b.Navigation("Packages");
                });
#pragma warning restore 612, 618
        }
    }
}