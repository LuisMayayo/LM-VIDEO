public class Asiento
{
    public int Numero { get; set; }
    public bool Disponible { get; set; } = true;
}

public class Funcion
{
    public int Id { get; set; }
    public int PeliculaId { get; set; }
    public int SalaId { get; set; }
    public DateTime Horario { get; set; }
    public List<Asiento> Asientos { get; set; }

    public Funcion(int id, int peliculaId, int salaId, DateTime horario, int capacidad)
    {
        Id = id;
        PeliculaId = peliculaId;
        SalaId = salaId;
        Horario = horario;

        // Inicializamos los asientos según la capacidad
        Asientos = new List<Asiento>();
        for (int i = 1; i <= capacidad; i++)
        {
            Asientos.Add(new Asiento { Numero = i });
        }
    }
}
