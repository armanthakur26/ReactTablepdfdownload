using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reacttable.Model;
using Reacttable.Repository.Irepository;
using static System.Reflection.Metadata.BlobBuilder;

namespace Reacttable.Controllers
{
    [Route("api/Shipment")]
    [ApiController]
    public class ShipmentController : ControllerBase
    {
        private readonly Ishipment _shipment;
        public ShipmentController(Ishipment shipment)
        {
            _shipment = shipment;
        }
        [HttpPost]
        public IActionResult createshipment([FromBody] Shippment shippment)
        {
            var add = _shipment.createshipment(shippment);
            return Ok(shippment);
        }
        [HttpGet]
        public IActionResult Getshipment()
        {
            var detail = _shipment.GetShippments();
            return Ok(detail);

        }
        [HttpDelete]
        public IActionResult Deleteshipment(int id)
        {

            var del = _shipment.deleteshipment(id);
            return Ok("Delete successfully");
        }
        [HttpPut]
        public IActionResult Updateshipment(Shippment shipment)
        {
            var update = _shipment.Updateshipment(shipment);
            return Ok("update successfully");
        }
    }
}
