using System;

namespace MyLibrary
{
    public class Class1
    {
        public void Method1()
        {

            int x = 4; int y = 9;
            x = (y % x != 0) ? y / x : y;
            Console.WriteLine($"x: {x}");
        }
    }
}
