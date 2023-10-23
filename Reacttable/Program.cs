using Microsoft.EntityFrameworkCore;
using Reacttable.Data;
using Reacttable.Repository;
using Reacttable.Repository.Irepository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string cs = builder.Configuration.GetConnectionString("constr");
builder.Services.AddDbContext<ApplicationDbcontext>(options=>options.UseSqlServer(cs));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyPolicy",
      builder =>
      {
          builder.WithOrigins("http://localhost:3000/")
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
      });
});
builder.Services.AddScoped<Ishipment, ShipmentRepository>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();
