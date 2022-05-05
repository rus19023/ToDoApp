using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

var names = new[] { "Doris", "oscar", "charlie" };
foreach (var name in names)
{
    Console.WriteLine($"Hello {name.ToUpper()}!");

}

public class Program
{
	public static void Main()
	{
		// Declare two dates
		var prevDate = new DateTime(2021, 7, 15); //15 July 2021
		var today = DateTime.Now;

		Console.WriteLine("prevDate: {0}", prevDate);
		Console.WriteLine("today: {0}", today);

		//get difference of two dates
		var diffOfDates = today - prevDate;
		Console.WriteLine("Difference in Timespan: {0}", diffOfDates);
		Console.WriteLine("Difference in Days: {0}", diffOfDates.Days);
		Console.WriteLine("Difference in Hours: {0}", diffOfDates.Hours);
		Console.WriteLine("Difference in Miniutes: {0}", diffOfDates.Minutes);
		Console.WriteLine("Difference in Seconds: {0}", diffOfDates.Seconds);
		Console.WriteLine("Difference in Milliseconds: {0}", diffOfDates.Milliseconds);
		Console.WriteLine("Difference in Ticks: {0}", diffOfDates.Ticks);

            //establish DateTimes
            DateTime start = new DateTime(2010, 6, 14);
            DateTime end = new DateTime(2016, 08, 14);
            //create TimeSpan object
            TimeSpan difference = end - start;
            //Extract days, write to Console.
            Console.WriteLine("Difference in days: " + difference.Days);


            // Exit program
            Write("\nThe Text before Exit");
            Environment.Exit(0);
            // Will not execute, it's after the program exits
            Write("\nThe Text after Exit");

            // Decrement loop by 2 each time it runs
            for (int x = 10; x > 0; x-=2)
            {
                Console.WriteLine(x);
            }


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

