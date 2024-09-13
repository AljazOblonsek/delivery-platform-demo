using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace delivery_service_api.Migrations
{
    /// <inheritdoc />
    public partial class add_title_to_package : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "packages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "title",
                table: "packages");
        }
    }
}
