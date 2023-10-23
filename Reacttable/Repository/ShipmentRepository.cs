using Microsoft.EntityFrameworkCore;
using Reacttable.Data;
using Reacttable.Model;
using Reacttable.Repository.Irepository;
using System.Net;

namespace Reacttable.Repository
{
    public class ShipmentRepository:Ishipment
    {
        private readonly ApplicationDbcontext _context;
        public ShipmentRepository(ApplicationDbcontext context) 
        {
            _context = context;
        }

      

        public bool createshipment(Shippment shippment)
        {
            _context.shippments.Add(shippment);
            return save();
        }

        public bool deleteshipment(int id)
        {

           var find= _context.shippments.Find(id);
            _context.shippments.Remove(find);
            return save();
        }


        public Shippment GetShippment(int id)
        {
            return _context.shippments.Find(id);
        }

        public ICollection<Shippment> GetShippments()
        {
          return _context.shippments.ToList();
        }

        public bool save()
        {
            return _context.SaveChanges() == 1 ? true : false;
        }

        public bool Updateshipment(Shippment shippment)
        {
            _context.shippments.Update(shippment);
            return save();
        }

      
    }
}
