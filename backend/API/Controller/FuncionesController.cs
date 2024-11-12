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
            funciones.Add(new Funcion(1, 1, 1, DateTime.Now.AddHours(2)));
            funciones.Add(new Funcion(2, 2, 1, DateTime.Now.AddHours(5)));
        }
    }
}
