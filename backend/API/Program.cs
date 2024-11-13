using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CineAPI.Controllers; 

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();

// Configurar Swagger (opcional, pero útil para probar APIs)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del pipeline de solicitud HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Inicializar los datos inicio de la aplicación
PeliculaController.InicializarDatos();
SalaController.InicializarDatos();
PagoController.InicializarDatos();
FuncionController.InicializarDatos();


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
