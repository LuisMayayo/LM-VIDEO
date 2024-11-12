public class Funcion
{
    public int Id { get; set; }
    public int PeliculaId { get; set; }
    public int SalaId { get; set; }
    public DateTime Horario { get; set; }

    public Funcion(int id, int peliculaId, int salaId, DateTime horario)
    {
        Id = id;
        PeliculaId = peliculaId;
        SalaId = salaId;
        Horario = horario;
    }
}
