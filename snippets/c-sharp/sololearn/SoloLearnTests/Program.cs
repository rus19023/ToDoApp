using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoloLearnTests
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // LambdaTest();

            // MultipleOfThree();

            System.Console.WriteLine(Discount(8000));
            System.Console.WriteLine(Discount(13000));
            PromptForExit();

        }  // End Main

        static int Discount(int price)
        {
            //complete the method body
            if (price >= 10000)
            {
                price = (int) (price * .8);
            }
            return price;
        }

        public static void PromptForExit()
        {
            Console.WriteLine("\nPress Enter to exit...");
            while (Console.ReadKey().Key != ConsoleKey.Enter) { }
        }

        private static void LambdaTest()
        {
            int x = 4; int y = 9;
            x = (y % x != 0) ? y / x : y;
            Console.WriteLine($"x: {x}");
        }  // End LambdaTest

        private static void MultipleOfThree()
        {
            Console.WriteLine("Enter a positive number between 1 and 10: ");
            int number = Convert.ToInt32(Console.ReadLine());
            string x = "";
            string y = "";

            for ( int i = 1;  i <= number;  i++ )
            {
                y += Convert.ToString(i % 3);
                x += (i % 3 == 0) ? "*" : Convert.ToString(i);
            }
            Console.WriteLine(x);
            Console.WriteLine(y);
            PromptForExit();
        }
    }
}
