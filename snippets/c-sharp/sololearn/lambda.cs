using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoloLearn
{
    class Program
    {
        static void Main(string[] args)
        {
            int x = 4; int y = 9;
            x = (y%x != 0) ? y/x : y;
            Console.WriteLine($"x: {x}");
        }
    }
}