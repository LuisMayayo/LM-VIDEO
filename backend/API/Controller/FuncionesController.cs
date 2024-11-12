using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CineAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionController : ControllerBase
    {
        private static List<Funcion> funciones = new List<Funcion>();

        [HttpGet]
        public ActionResult<IEnumerable<Funcion>> GetFunciones()
        {
            return Ok(funciones);
        }

        [HttpGet("{id}")]
        public ActionResult<Funcion> GetFuncion(int id)
        {
            var funcion = funciones.FirstOrDefault(f => f.Id == id);
            if (funcion == null)
            {
                return NotFound();
            }
            return Ok(funcion);
        }

        [HttpPost]
        public ActionResult<Funcion> CreateFuncion(Funcion funcion)
        {
            funciones.Add(funcion);
            return CreatedAtAction(nameof(GetFuncion), new { id = funcion.Id }, funcion);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFuncion(int id, Funcion updatedFuncion)
        {
            var funcion = funciones.FirstOrDefault(f => f.Id == id);
            if (funcion == null)
            {
                return NotFound();
            }
            funcion.PeliculaId = updatedFuncion.PeliculaId;
            funcion.SalaId = updatedFuncion.SalaId;
            funcion.Horario = updatedFuncion.Horario;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFuncion(int id)
        {
            var funcion = funciones.FirstOrDefault(f => f.Id == id);
            if (funcion == null)
            {
                return NotFound();
            }
            funciones.Remove(funcion);
            return NoContent();
        }

        public static void InicializarDatos()
        {
            // Películas en Sala 1 con diferentes horarios
            funciones.Add(new Funcion(1, 1, 1, DateTime.Today.AddHours(10))); // Película 1, Sala 1, 10:00 AM
            funciones.Add(new Funcion(2, 2, 1, DateTime.Today.AddHours(13))); // Película 2, Sala 1, 1:00 PM
            funciones.Add(new Funcion(3, 3, 1, DateTime.Today.AddHours(16))); // Película 3, Sala 1, 4:00 PM
            funciones.Add(new Funcion(4, 4, 1, DateTime.Today.AddHours(19))); // Película 4, Sala 1, 7:00 PM
            funciones.Add(new Funcion(5, 5, 1, DateTime.Today.AddHours(21))); // Película 5, Sala 1, 9:00 PM
            funciones.Add(new Funcion(6, 6, 1, DateTime.Today.AddHours(23))); // Película 6, Sala 1, 11:00 PM

            // Películas en Sala 2 con diferentes horarios
            funciones.Add(new Funcion(7, 1, 2, DateTime.Today.AddHours(11))); // Película 1, Sala 2, 11:00 AM
            funciones.Add(new Funcion(8, 2, 2, DateTime.Today.AddHours(14))); // Película 2, Sala 2, 2:00 PM
            funciones.Add(new Funcion(9, 3, 2, DateTime.Today.AddHours(17))); // Película 3, Sala 2, 5:00 PM
            funciones.Add(new Funcion(10, 4, 2, DateTime.Today.AddHours(20))); // Película 4, Sala 2, 8:00 PM
            funciones.Add(new Funcion(11, 5, 2, DateTime.Today.AddHours(22))); // Película 5, Sala 2, 10:00 PM
            funciones.Add(new Funcion(12, 6, 2, DateTime.Today.AddHours(24))); // Película 6, Sala 2, 12:00 AM (medianoche)

            // Películas en Sala 3 con diferentes horarios
            funciones.Add(new Funcion(13, 1, 3, DateTime.Today.AddHours(10))); // Película 1, Sala 3, 10:00 AM
            funciones.Add(new Funcion(14, 2, 3, DateTime.Today.AddHours(13))); // Película 2, Sala 3, 1:00 PM
            funciones.Add(new Funcion(15, 3, 3, DateTime.Today.AddHours(16))); // Película 3, Sala 3, 4:00 PM
            funciones.Add(new Funcion(16, 4, 3, DateTime.Today.AddHours(19))); // Película 4, Sala 3, 7:00 PM
            funciones.Add(new Funcion(17, 5, 3, DateTime.Today.AddHours(21))); // Película 5, Sala 3, 9:00 PM
            funciones.Add(new Funcion(18, 6, 3, DateTime.Today.AddHours(23))); // Película 6, Sala 3, 11:00 PM
        }


    }
}
