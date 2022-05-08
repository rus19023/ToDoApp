using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoloLearnTests
{
    class test1
    {
        public int num = 2;
        public test1() { num++; }
        ~test1() { num++; }
    }

    static void Main(string[] args)
    {
        test1 t = new test1();
        Console.WriteLine(t.num);
    }
}
