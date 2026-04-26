using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobMatcher.IdentityCore.Migrations;

public partial class AddCandidatesAndRelatedEntities : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Candidates",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                FullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                Phone = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                ResumeText = table.Column<string>(type: "text", nullable: true),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Candidates", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Skills",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Skills", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "CandidateSkills",
            columns: table => new
            {
                CandidateId = table.Column<Guid>(type: "uuid", nullable: false),
                SkillId = table.Column<Guid>(type: "uuid", nullable: false),
                Level = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CandidateSkills", x => new { x.CandidateId, x.SkillId });
                table.ForeignKey(
                    name: "FK_CandidateSkills_Candidates_CandidateId",
                    column: x => x.CandidateId,
                    principalTable: "Candidates",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_CandidateSkills_Skills_SkillId",
                    column: x => x.SkillId,
                    principalTable: "Skills",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "WorkExperiences",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CandidateId = table.Column<Guid>(type: "uuid", nullable: false),
                CompanyName = table.Column<string>(type: "text", nullable: false),
                Role = table.Column<string>(type: "text", nullable: false),
                Description = table.Column<string>(type: "text", nullable: true),
                StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_WorkExperiences", x => x.Id);
                table.ForeignKey(
                    name: "FK_WorkExperiences_Candidates_CandidateId",
                    column: x => x.CandidateId,
                    principalTable: "Candidates",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "Educations",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                CandidateId = table.Column<Guid>(type: "uuid", nullable: false),
                Institution = table.Column<string>(type: "text", nullable: false),
                Degree = table.Column<string>(type: "text", nullable: false),
                FieldOfStudy = table.Column<string>(type: "text", nullable: true),
                StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Educations", x => x.Id);
                table.ForeignKey(
                    name: "FK_Educations_Candidates_CandidateId",
                    column: x => x.CandidateId,
                    principalTable: "Candidates",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Skills_Name",
            table: "Skills",
            column: "Name",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_CandidateSkills_SkillId",
            table: "CandidateSkills",
            column: "SkillId");

        migrationBuilder.CreateIndex(
            name: "IX_WorkExperiences_CandidateId",
            table: "WorkExperiences",
            column: "CandidateId");

        migrationBuilder.CreateIndex(
            name: "IX_Educations_CandidateId",
            table: "Educations",
            column: "CandidateId");

        // Add FK from Applications to Candidates (Applications table already contains CandidateId column)
        migrationBuilder.AddForeignKey(
            name: "FK_Applications_Candidates_CandidateId",
            table: "Applications",
            column: "CandidateId",
            principalTable: "Candidates",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Applications_Candidates_CandidateId",
            table: "Applications");

        migrationBuilder.DropTable(
            name: "CandidateSkills");

        migrationBuilder.DropTable(
            name: "WorkExperiences");

        migrationBuilder.DropTable(
            name: "Educations");

        migrationBuilder.DropTable(
            name: "Skills");

        migrationBuilder.DropTable(
            name: "Candidates");
    }
}
