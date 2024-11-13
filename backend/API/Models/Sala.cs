public class Sala
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public int Capacidad { get; set; }  // Capacidad de asientos
    public List<Funcion> Funciones { get; set; } = new List<Funcion>(); // Lista de funciones en la sala

    public Sala(int id, string nombre, int capacidad)
    {
        Id = id;
        Nombre = nombre;
        Capacidad = capacidad;
    }
}
