using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using JobMatcher.IdentityCore.Configurations;
using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Services
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings _settings;
        public JwtService(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        public AuthResponse GenerateJwt(AppUser user, IEnumerable<string> roles)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret ?? string.Empty));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim("fullName", user.FullName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var expires = DateTime.UtcNow.AddMinutes(_settings.ExpirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResponse
            {
                Token = tokenString,
                Expiration = expires,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FullName = user.FullName
                }
            };
        }
    }
}
