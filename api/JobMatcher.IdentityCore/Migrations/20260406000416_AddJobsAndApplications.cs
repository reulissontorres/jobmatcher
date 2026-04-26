using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobMatcher.IdentityCore.Migrations;

/// <inheritdoc />
public partial class AddJobsAndApplications : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Jobs",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                Description = table.Column<string>(type: "text", nullable: false),
                Requirements = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                Location = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                SalaryRange = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                EmploymentType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                CompanyId = table.Column<Guid>(type: "uuid", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Jobs", x => x.Id);
                table.ForeignKey(
                    name: "FK_Jobs_Companies_CompanyId",
                    column: x => x.CompanyId,
                    principalTable: "Companies",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "Applications",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                JobId = table.Column<Guid>(type: "uuid", nullable: false),
                CandidateId = table.Column<Guid>(type: "uuid", nullable: false),
                MatchScore = table.Column<double>(type: "double precision", nullable: false, defaultValue: 0.0),
                Status = table.Column<string>(type: "text", nullable: true),
                AppliedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Applications", x => x.Id);
                table.ForeignKey(
                    name: "FK_Applications_Jobs_JobId",
                    column: x => x.JobId,
                    principalTable: "Jobs",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Applications_JobId",
            table: "Applications",
            column: "JobId");

        migrationBuilder.CreateIndex(
            name: "IX_Jobs_CompanyId",
            table: "Jobs",
            column: "CompanyId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Applications");

        migrationBuilder.DropTable(
            name: "Jobs");
    }
}
