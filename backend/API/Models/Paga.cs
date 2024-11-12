public class Pago
{
    public int Id { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string Metodo { get; set; } // Ejemplo: "Tarjeta de Crédito"
    public bool TransaccionExitosa { get; set; }

    public Pago(int id, decimal monto, DateTime fecha, string metodo, bool transaccionExitosa)
    {
        Id = id;
        Monto = monto;
        Fecha = fecha;
        Metodo = metodo;
        TransaccionExitosa = transaccionExitosa;
    }
}
