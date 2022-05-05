using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


public class Program
{
	public static void Main()
	{
            bool condition1 = false;
            bool condition2 = false;
            bool condition3 = true;
            bool condition4 = false;

            if (condition1)
            {
            // A
                Write("//A");
            }
            else if (condition2)
            {
                // B
                Write("//B");
            }
            else if (condition3)
            {
            if (condition4)
            {
                // C
                Write("//A");
            }
            else
            {
                // D
                Write("//D");
            }
            }
            else
            {
            // E
                Write("//E");
            }

	}
}

