using Reacttable.Model;
using static System.Reflection.Metadata.BlobBuilder;

namespace Reacttable.Repository.Irepository
{
    public interface Ishipment
    {
        ICollection<Shippment> GetShippments();
        Shippment GetShippment(int id);   
        bool createshipment(Shippment shippment);
        bool Updateshipment(Shippment shippment);
        bool deleteshipment(int id);
        bool save();
 
    }
}
