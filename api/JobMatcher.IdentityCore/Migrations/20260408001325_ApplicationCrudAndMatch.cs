using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobMatcher.IdentityCore.Migrations;

/// <inheritdoc />
public partial class ApplicationCrudAndMatch : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "Applications",
            type: "text",
            nullable: false,
            defaultValue: "Pending",
            oldClrType: typeof(string),
            oldType: "text",
            oldNullable: true);

        migrationBuilder.CreateTable(
            name: "EmbeddingStorages",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                EntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                Vector = table.Column<string>(type: "text", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_EmbeddingStorages", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_EmbeddingStorages_EntityType_EntityId",
            table: "EmbeddingStorages",
            columns: new[] { "EntityType", "EntityId" },
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "EmbeddingStorages");

        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "Applications",
            type: "text",
            nullable: true,
            oldClrType: typeof(string),
            oldType: "text",
            oldDefaultValue: "Pending");
    }
}
