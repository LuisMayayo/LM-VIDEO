using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CineAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoController : ControllerBase
    {
        private static List<Pago> pagos = new List<Pago>();

        [HttpGet]
        public ActionResult<IEnumerable<Pago>> GetPagos()
        {
            return Ok(pagos);
        }

        [HttpGet("{id}")]
        public ActionResult<Pago> GetPago(int id)
        {
            var pago = pagos.FirstOrDefault(p => p.Id == id);
            if (pago == null)
            {
                return NotFound();
            }
            return Ok(pago);
        }

        [HttpPost]
        public ActionResult<Pago> CreatePago(Pago pago)
        {
            pagos.Add(pago);
            return CreatedAtAction(nameof(GetPago), new { id = pago.Id }, pago);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePago(int id, Pago updatedPago)
        {
            var pago = pagos.FirstOrDefault(p => p.Id == id);
            if (pago == null)
            {
                return NotFound();
            }
            pago.Monto = updatedPago.Monto;
            pago.Fecha = updatedPago.Fecha;
            pago.Metodo = updatedPago.Metodo;
            pago.TransaccionExitosa = updatedPago.TransaccionExitosa;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePago(int id)
        {
            var pago = pagos.FirstOrDefault(p => p.Id == id);
            if (pago == null)
            {
                return NotFound();
            }
            pagos.Remove(pago);
            return NoContent();
        }

        public static void InicializarDatos()
        {
            pagos.Add(new Pago(1, 12.50m, DateTime.Now, "Tarjeta de Crédito", true));
            pagos.Add(new Pago(2, 15.00m, DateTime.Now, "Tarjeta de Débito", true));
        }
    }
}
