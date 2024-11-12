public class Asiento
{
    public int Id { get; set; }
    public int Numero { get; set; }
    public bool EstaDisponible { get; set; } = true;

    public Asiento(int id, int numero, bool estaDisponible)
    {
        Id = id;
        Numero = numero;
        EstaDisponible = estaDisponible;
    }
}
