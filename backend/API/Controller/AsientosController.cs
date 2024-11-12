using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CineAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsientoController : ControllerBase
    {
        private static List<Asiento> asientos = new List<Asiento>();

        [HttpGet]
        public ActionResult<IEnumerable<Asiento>> GetAsientos()
        {
            return Ok(asientos);
        }

        [HttpGet("{id}")]
        public ActionResult<Asiento> GetAsiento(int id)
        {
            var asiento = asientos.FirstOrDefault(a => a.Id == id);
            if (asiento == null)
            {
                return NotFound();
            }
            return Ok(asiento);
        }

        [HttpPost]
        public ActionResult<Asiento> CreateAsiento(Asiento asiento)
        {
            asientos.Add(asiento);
            return CreatedAtAction(nameof(GetAsiento), new { id = asiento.Id }, asiento);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAsiento(int id, Asiento updatedAsiento)
        {
            var asiento = asientos.FirstOrDefault(a => a.Id == id);
            if (asiento == null)
            {
                return NotFound();
            }
            asiento.Numero = updatedAsiento.Numero;
            asiento.EstaDisponible = updatedAsiento.EstaDisponible;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAsiento(int id)
        {
            var asiento = asientos.FirstOrDefault(a => a.Id == id);
            if (asiento == null)
            {
                return NotFound();
            }
            asientos.Remove(asiento);
            return NoContent();
        }

        public static void InicializarDatos()
        {
            for (int i = 1; i <= 25; i++)
            {
                asientos.Add(new Asiento(i, i, true));
            }
        }

    }
}
