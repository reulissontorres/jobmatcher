using JobMatcher.IdentityCore.Data;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Entities;
using Microsoft.AspNetCore.Identity;

namespace JobMatcher.IdentityCore.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext dbContext,
            IJwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public async Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest model)
        {
            var existing = await _userManager.FindByEmailAsync(model.Email);
            if (existing != null)
                return ServiceResult<AuthResponse>.Failure("Email already in use.");

            Company? company = null;
            if (!string.IsNullOrWhiteSpace(model.CompanyName))
            {
                company = new Company { Id = Guid.NewGuid(), Name = model.CompanyName, CreatedAt = DateTime.UtcNow };
                _dbContext.Companies.Add(company);
                await _dbContext.SaveChangesAsync();
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                CompanyId = company?.Id
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToArray();
                return ServiceResult<AuthResponse>.Failure(errors);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var auth = _jwtService.GenerateJwt(user, roles);
            return ServiceResult<AuthResponse>.Success(auth);
        }

        public async Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return ServiceResult<AuthResponse>.Failure("Invalid credentials.");

            var valid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!valid)
                return ServiceResult<AuthResponse>.Failure("Invalid credentials.");

            var roles = await _userManager.GetRolesAsync(user);
            var auth = _jwtService.GenerateJwt(user, roles);
            return ServiceResult<AuthResponse>.Success(auth);
        }
    }
}
