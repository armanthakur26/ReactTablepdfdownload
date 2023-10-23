using Microsoft.EntityFrameworkCore;
using Reacttable.Model;
using static System.Reflection.Metadata.BlobBuilder;

namespace Reacttable.Data
{
    public class ApplicationDbcontext:DbContext
    {
        public ApplicationDbcontext(DbContextOptions<ApplicationDbcontext> options) : base(options)
        { }
        public DbSet<Shippment> shippments { get; set; }
    }
}
