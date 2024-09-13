using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace delivery_service_api.Migrations
{
    /// <inheritdoc />
    public partial class fix_package_add_unique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_packages_packages_package_id",
                table: "packages");

            migrationBuilder.DropForeignKey(
                name: "FK_packages_workers_WorkerEntityId",
                table: "packages");

            migrationBuilder.DropIndex(
                name: "IX_packages_WorkerEntityId",
                table: "packages");

            migrationBuilder.DropColumn(
                name: "WorkerEntityId",
                table: "packages");

            migrationBuilder.RenameColumn(
                name: "package_id",
                table: "packages",
                newName: "worker_id");

            migrationBuilder.RenameIndex(
                name: "IX_packages_package_id",
                table: "packages",
                newName: "IX_packages_worker_id");

            migrationBuilder.AlterColumn<string>(
                name: "lastname",
                table: "workers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "hashed_password",
                table: "workers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "firstname",
                table: "workers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "workers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "track_number",
                table: "packages",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "companies",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_packages_track_number",
                table: "packages",
                column: "track_number",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages",
                column: "worker_id",
                principalTable: "workers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_packages_workers_worker_id",
                table: "packages");

            migrationBuilder.DropIndex(
                name: "IX_packages_track_number",
                table: "packages");

            migrationBuilder.RenameColumn(
                name: "worker_id",
                table: "packages",
                newName: "package_id");

            migrationBuilder.RenameIndex(
                name: "IX_packages_worker_id",
                table: "packages",
                newName: "IX_packages_package_id");

            migrationBuilder.AlterColumn<string>(
                name: "lastname",
                table: "workers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "hashed_password",
                table: "workers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "firstname",
                table: "workers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "workers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "track_number",
                table: "packages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkerEntityId",
                table: "packages",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "companies",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_packages_WorkerEntityId",
                table: "packages",
                column: "WorkerEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_packages_packages_package_id",
                table: "packages",
                column: "package_id",
                principalTable: "packages",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_packages_workers_WorkerEntityId",
                table: "packages",
                column: "WorkerEntityId",
                principalTable: "workers",
                principalColumn: "id");
        }
    }
}
