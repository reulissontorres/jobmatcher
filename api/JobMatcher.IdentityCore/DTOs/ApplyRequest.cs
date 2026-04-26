using System;

namespace JobMatcher.IdentityCore.DTOs;

public class ApplyRequest
{
    public Guid CandidateId { get; set; }
    public Guid JobId { get; set; }
}
