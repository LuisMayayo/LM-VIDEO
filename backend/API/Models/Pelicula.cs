public class Pelicula
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
    public int Duracion { get; set; } // Duración en minutos
    public string FotoUrl { get; set; } // URL o ruta de la foto

    public Pelicula(int id, string titulo, string descripcion, int duracion, string fotoUrl)
    {
        Id = id;
        Titulo = titulo;
        Descripcion = descripcion;
        Duracion = duracion;
        FotoUrl = fotoUrl;
    }
}
