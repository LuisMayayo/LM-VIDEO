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

        static FuncionController()
        {
            if (funciones.Count == 0)
            {
                InicializarDatos();
            }
        }

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

        [HttpPut("{id}/ReservarAsientos")]
        public IActionResult ReservarAsiento(int id, List<int> asientos)
        {
            var funcion = funciones.FirstOrDefault(f => f.Id == id);
            if (funcion == null)
            {
                return NotFound();
            }

            List<int> asientosNoDisponibles = new List<int>();

            // Verifica la disponibilidad y reserva los asientos solicitados
            foreach (var numeroAsiento in asientos)
            {
                var asiento = funcion.Asientos.FirstOrDefault(a => a.Numero == numeroAsiento);
                if (asiento != null)
                {
                    if (!asiento.Disponible)
                    {
                        asientosNoDisponibles.Add(numeroAsiento); // Agrega a la lista de asientos ocupados
                    }
                    else
                    {
                        asiento.Disponible = false; // Reserva el asiento
                    }
                }
                else
                {
                    return BadRequest($"El asiento {numeroAsiento} no existe en esta función.");
                }
            }

            if (asientosNoDisponibles.Any())
            {
                return BadRequest($"Los siguientes asientos ya están reservados: {string.Join(", ", asientosNoDisponibles)}");
            }

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
            // Definimos funciones con distintas capacidades en las salas
            funciones.Add(new Funcion(1, 1, 1, DateTime.Today.AddHours(10), 60)); 
            funciones.Add(new Funcion(2, 2, 1, DateTime.Today.AddHours(13), 60));
            funciones.Add(new Funcion(3, 3, 1, DateTime.Today.AddHours(16), 60));
            funciones.Add(new Funcion(4, 4, 1, DateTime.Today.AddHours(19), 60));
            funciones.Add(new Funcion(5, 5, 1, DateTime.Today.AddHours(21), 60));
            funciones.Add(new Funcion(6, 6, 1, DateTime.Today.AddHours(23), 60));

            funciones.Add(new Funcion(7, 1, 2, DateTime.Today.AddHours(11), 60)); 
            funciones.Add(new Funcion(8, 2, 2, DateTime.Today.AddHours(14), 60));
            funciones.Add(new Funcion(9, 3, 2, DateTime.Today.AddHours(17), 60));
            funciones.Add(new Funcion(10, 4, 2, DateTime.Today.AddHours(20), 60));
            funciones.Add(new Funcion(11, 5, 2, DateTime.Today.AddHours(22), 60));
            funciones.Add(new Funcion(12, 6, 2, DateTime.Today.AddHours(24), 60));

            funciones.Add(new Funcion(13, 1, 3, DateTime.Today.AddHours(10), 60)); 
            funciones.Add(new Funcion(14, 2, 3, DateTime.Today.AddHours(13), 60));
            funciones.Add(new Funcion(15, 3, 3, DateTime.Today.AddHours(16), 60));
            funciones.Add(new Funcion(16, 4, 3, DateTime.Today.AddHours(19), 60));
            funciones.Add(new Funcion(17, 5, 3, DateTime.Today.AddHours(21), 60));
            funciones.Add(new Funcion(18, 6, 3, DateTime.Today.AddHours(23), 60));
        }
    }
}
