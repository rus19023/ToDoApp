namespace MegaDesk
{
    partial class MegaDeskMainMenu1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnAddQuote = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.btnViewQuotes = new System.Windows.Forms.Button();
            this.btnSearchQuotes = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnAddQuote
            // 
            this.btnAddQuote.AllowDrop = true;
            this.btnAddQuote.BackColor = System.Drawing.Color.LemonChiffon;
            this.btnAddQuote.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnAddQuote.Font = new System.Drawing.Font("Century Gothic", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAddQuote.ForeColor = System.Drawing.Color.DarkOliveGreen;
            this.btnAddQuote.Location = new System.Drawing.Point(750, 100);
            this.btnAddQuote.Name = "btnAddQuote";
            this.btnAddQuote.Size = new System.Drawing.Size(300, 100);
            this.btnAddQuote.TabIndex = 0;
            this.btnAddQuote.Text = "Add Quote";
            this.btnAddQuote.UseVisualStyleBackColor = false;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.Color.Olive;
            this.label1.Location = new System.Drawing.Point(650, 700);
            this.label1.MaximumSize = new System.Drawing.Size(500, 100);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(319, 49);
            this.label1.TabIndex = 1;
            this.label1.Text = "MegaDesk 1.0";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.BackColor = System.Drawing.Color.Olive;
            this.label2.Location = new System.Drawing.Point(170, 250);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(256, 49);
            this.label2.TabIndex = 2;
            this.label2.Text = "Main Menu";
            // 
            // btnViewQuotes
            // 
            this.btnViewQuotes.AllowDrop = true;
            this.btnViewQuotes.BackColor = System.Drawing.Color.LemonChiffon;
            this.btnViewQuotes.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnViewQuotes.Font = new System.Drawing.Font("Century Gothic", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnViewQuotes.ForeColor = System.Drawing.Color.DarkOliveGreen;
            this.btnViewQuotes.Location = new System.Drawing.Point(750, 250);
            this.btnViewQuotes.Name = "btnViewQuotes";
            this.btnViewQuotes.Size = new System.Drawing.Size(300, 100);
            this.btnViewQuotes.TabIndex = 3;
            this.btnViewQuotes.Text = "View Quotes";
            this.btnViewQuotes.UseVisualStyleBackColor = false;
            // 
            // btnSearchQuotes
            // 
            this.btnSearchQuotes.AllowDrop = true;
            this.btnSearchQuotes.BackColor = System.Drawing.Color.LemonChiffon;
            this.btnSearchQuotes.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnSearchQuotes.Font = new System.Drawing.Font("Century Gothic", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSearchQuotes.ForeColor = System.Drawing.Color.DarkOliveGreen;
            this.btnSearchQuotes.Location = new System.Drawing.Point(750, 400);
            this.btnSearchQuotes.Name = "btnSearchQuotes";
            this.btnSearchQuotes.Size = new System.Drawing.Size(300, 100);
            this.btnSearchQuotes.TabIndex = 4;
            this.btnSearchQuotes.Text = "Search Quotes";
            this.btnSearchQuotes.UseVisualStyleBackColor = false;
            // 
            // btnExit
            // 
            this.btnExit.AllowDrop = true;
            this.btnExit.BackColor = System.Drawing.Color.LemonChiffon;
            this.btnExit.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btnExit.Font = new System.Drawing.Font("Century Gothic", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnExit.ForeColor = System.Drawing.Color.DarkOliveGreen;
            this.btnExit.Location = new System.Drawing.Point(750, 550);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(300, 100);
            this.btnExit.TabIndex = 5;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = false;
            // 
            // MegaDeskMainMenu1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(26F, 49F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.DarkKhaki;
            this.BackgroundImage = global::MegaDesk_Rush_Lopez.Properties.Resources.mainmenu600x900;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.ClientSize = new System.Drawing.Size(1184, 701);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.btnSearchQuotes);
            this.Controls.Add(this.btnViewQuotes);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnAddQuote);
            this.Font = new System.Drawing.Font("Century Gothic", 32F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.ForeColor = System.Drawing.Color.LemonChiffon;
            this.Margin = new System.Windows.Forms.Padding(13, 12, 13, 12);
            this.MinimizeBox = false;
            this.MinimumSize = new System.Drawing.Size(1200, 670);
            this.Name = "MegaDeskMainMenu1";
            this.Text = "Main Menu - MegaDesk v1.0";
            this.Load += new System.EventHandler(this.MainMenu_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnAddQuote;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button btnViewQuotes;
        private System.Windows.Forms.Button btnSearchQuotes;
        private System.Windows.Forms.Button btnExit;
    }
}

