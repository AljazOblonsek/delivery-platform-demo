using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace delivery_service_api.Migrations
{
    /// <inheritdoc />
    public partial class fix_package_worker_relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages");

            migrationBuilder.AlterColumn<int>(
                name: "worker_id",
                table: "packages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages",
                column: "worker_id",
                principalTable: "workers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages");

            migrationBuilder.AlterColumn<int>(
                name: "worker_id",
                table: "packages",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages",
                column: "worker_id",
                principalTable: "workers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
