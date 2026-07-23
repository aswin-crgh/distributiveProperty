// All copy lives here → window.T. Components read window.T.ui.*.
(() => {
  const CURRENT_LANGUAGE = window.CURRENT_LANGUAGE || "en";

  const appData = {
    en: {
      title: "Factoring an expression — the opposite of distributing",
      ui: {
        exploreButton: "Explore visually",
        next: "»",
        hcfLabel: "HCF",

        // ---- Scene 1 — intro ----
        introStatement:
          "Sometimes, it helps to write an expression<br/>" +
          "as a product of factors, not individual terms —<br/>" +
          "this can make it simpler to work with.<br/><br/>" +
          "We use the distributive property to write a<br/>" +
          "sum of products as a product of a sum.",
        introInstruction: "Tap ‘Explore’ to start",

        // ---- Scene 2 — scatter + rearrange ----
        scatterHeader: "What is the value on the board?",
        legendUnit: "1",
        legendTerm: "1 m",
        rearrangeBtn: "Rearrange neatly",
        scatterInstruction: "Tap ‘Rearrange’ to help us in counting",
        valueOnBoard: "value on board = ",
        duplicateText: "make a copy of the board,<br/>to re-arrange differently",
        duplicateBtn: "Duplicate",
        duplicateInstruction: "Tap ‘Duplicate’ to rearrange the board",

        // ---- Scene 3 — drag to rectangle ----
        dragHeader: "Rearrange the values on the board to form a rectangle",
        dragInstruction: "Drag and drop to move the pieces around",

        // ---- Scene 4 — reveal dimensions + area ----
        revealInstruction: "Tap the rectangle to see its side lengths",
        overlay1Text: "The 2 here is a factor of both 4 and 6 — the numbers in our expression's terms!<br/><br/><span class=\"overlay-tap-hint\">Tap anywhere to continue</span>",
        rectangleSidesText: "Side lengths 2 and ( 2 m + 3 ).<br/>Area = the value on the board!",
        revealAreaBtn: "Reveal Area",
        revealAreaInstruction: "Tap ‘Reveal’ to express value in terms of area of rectangle",
        sameValueHeader: "We now have the same value on board represented in 2 different ways!",
        algebraInstruction: "Tap » to explore this algebraically",

        // ---- Scene 5 — 4-step HCF walkthrough ----
        stepsHeader: "Steps to move from unfactored to factored expression…",
        step1Label: "Step 1:",
        step2Label: "Step 2:",
        step3Label: "Step 3:",
        step4Label: "Step 4:",
        step1Text: "Identify coefficients<br/>and the constants",
        step2Text: "Find HCF of coefficients<br/>and constants",
        step3Text: "Re-write the expression<br/>as a sum of products",
        step4Text: "Factor out the HCF,<br/>add brackets to the terms",
        step1Short: "Identify coefficients and constants",
        step2Short: "Find HCF",
        step3Short: "Re-write as sum of products",
        step4Short: "Factor out the HCF",
        step1Instruction: "Tap the expression to see Step 1",
        step2Instruction: "Tap the highlighted text to see step 2",
        step3Instruction: "Tap the highlighted text to see step 3",
        step4Instruction: "Tap the highlighted text to see step 4",
        overlay2Text: "See — this is the HCF 2, which formed one of the sides of the rectangle!<br/>Rectangle area is nothing but product of factors!<br/><br/><span class=\"overlay-tap-hint\">Tap anywhere to continue</span>",
        stepsDoneInstruction: "Tap » to see distribution and factoring at play",

        // ---- Scene 6 — distribute/factor loop + summary ----
        loopHeader: "Distribution and Factoring express the value in different forms!",
        distributeBtn: "Distribute Across",
        factorBtn: "Factor the terms",
        loopInstructionStart: "Tap ‘Distribute’ or ‘Factor’",
        loopInstructionOne: "Tap the other button, or » to summarise",
        loopInstructionDone: "Tap » to summarise",
        summariseHeader: "Distribution and Factoring express the value in different forms!",

        // ---- Scene 7 — summary ----
        distributedFormTitle: "Distributed Form",
        factorFormTitle: "Factor Form",
        distributedFormText:
          "Expression is written as a sum or difference of products (where each " +
          "product is either a number for constant terms or a number times a variable)",
        factorFormText:
          "Expression is written as a factor with the HCF of terms multiplied with a " +
          "sum or difference of terms, written in brackets.",
        distributedFormText2: "A factored form can be 'expanded' by multiplying the factor with each term within the brackets.",
        factorFormText2: "A distributed form can be factored in 4 steps:",
        summaryInstruction: "Tap » to see the steps of converting from one form to another",
        activityCompleted: "Activity Completed",
        startOver: "Start Over"
      }
    },

    id: {
      title: "Memfaktorkan sebuah ekspresi — kebalikan dari mendistribusikan",
      ui: {
        exploreButton: "Eksplorasi visual",
        next: "»",
        hcfLabel: "FPB",

        // ---- Scene 1 — intro ----
        introStatement:
          "Terkadang, akan lebih mudah bila kita menuliskan<br/>" +
          "suatu ekspresi sebagai hasil kali faktor,<br/>" +
          "bukan suku-suku terpisah — supaya lebih sederhana.<br/><br/>" +
          "Kita memakai sifat distributif untuk menuliskan<br/>" +
          "jumlah hasil kali sebagai hasil kali dari suatu jumlah.",
        introInstruction: "Ketuk ‘Eksplorasi’ untuk mulai",

        // ---- Scene 2 — scatter + rearrange ----
        scatterHeader: "Berapa nilai di papan?",
        legendUnit: "1",
        legendTerm: "1 m",
        rearrangeBtn: "Rapikan",
        scatterInstruction: "Ketuk ‘Rapikan’ untuk membantu kita berhitung",
        valueOnBoard: "nilai di papan = ",
        duplicateText: "buat salinan papan,<br/>untuk ditata ulang dengan cara berbeda",
        duplicateBtn: "Gandakan",
        duplicateInstruction: "Ketuk ‘Gandakan’ untuk menata ulang papan",

        // ---- Scene 3 — drag to rectangle ----
        dragHeader: "Tata ulang nilai-nilai di papan untuk membentuk persegi panjang",
        dragInstruction: "Seret dan lepas untuk memindahkan potongan-potongannya",

        // ---- Scene 4 — reveal dimensions + area ----
        revealInstruction: "Ketuk persegi panjang untuk melihat panjang sisi-sisinya",
        overlay1Text: "Angka 2 di sini adalah faktor dari 4 dan 6 — bilangan pada suku-suku ekspresi kita!<br/><br/><span class=\"overlay-tap-hint\">Ketuk di mana saja untuk melanjutkan</span>",
        rectangleSidesText: "Panjang sisi 2 dan ( 2 m + 3 ).<br/>Luas = nilai di papan!",
        revealAreaBtn: "Tampilkan Luas",
        revealAreaInstruction: "Ketuk ‘Tampilkan’ untuk menyatakan nilai sebagai luas persegi panjang",
        sameValueHeader: "Sekarang kita punya nilai yang sama di papan, dinyatakan dengan 2 cara berbeda!",
        algebraInstruction: "Ketuk » untuk menjelajahi ini secara aljabar",

        // ---- Scene 5 — 4-step HCF walkthrough ----
        stepsHeader: "Langkah-langkah mengubah ekspresi belum difaktorkan menjadi bentuk faktor…",
        step1Label: "Langkah 1:",
        step2Label: "Langkah 2:",
        step3Label: "Langkah 3:",
        step4Label: "Langkah 4:",
        step1Text: "Identifikasi koefisien<br/>dan konstanta",
        step2Text: "Cari FPB dari koefisien<br/>dan konstanta",
        step3Text: "Tulis ulang ekspresi<br/>sebagai jumlah hasil kali",
        step4Text: "Keluarkan FPB-nya,<br/>tambahkan kurung pada suku-suku",
        step1Short: "Identifikasi koefisien dan konstanta",
        step2Short: "Cari FPB",
        step3Short: "Tulis ulang sebagai jumlah hasil kali",
        step4Short: "Keluarkan FPB-nya",
        step1Instruction: "Ketuk ekspresi untuk melihat Langkah 1",
        step2Instruction: "Ketuk teks yang disorot untuk melihat langkah 2",
        step3Instruction: "Ketuk teks yang disorot untuk melihat langkah 3",
        step4Instruction: "Ketuk teks yang disorot untuk melihat langkah 4",
        overlay2Text: "Lihat — ini adalah FPB 2, yang menjadi salah satu sisi persegi panjang!<br/>Luas persegi panjang tidak lain adalah hasil kali faktor-faktornya!<br/><br/><span class=\"overlay-tap-hint\">Ketuk di mana saja untuk melanjutkan</span>",
        stepsDoneInstruction: "Ketuk » untuk melihat distribusi dan pemfaktoran beraksi",

        // ---- Scene 6 — distribute/factor loop + summary ----
        loopHeader: "Distribusi dan Pemfaktoran menyatakan nilai yang sama dalam bentuk berbeda!",
        distributeBtn: "Distribusikan",
        factorBtn: "Faktorkan Suku-sukunya",
        loopInstructionStart: "Ketuk ‘Distribusikan’ atau ‘Faktorkan’",
        loopInstructionOne: "Ketuk tombol yang lain, atau » untuk merangkum",
        loopInstructionDone: "Ketuk » untuk merangkum",
        summariseHeader: "Distribusi dan Pemfaktoran menyatakan nilai yang sama dalam bentuk berbeda!",

        // ---- Scene 7 — summary ----
        distributedFormTitle: "Bentuk Terdistribusi",
        factorFormTitle: "Bentuk Faktor",
        distributedFormText:
          "Ekspresi dituliskan sebagai jumlah atau selisih dari hasil kali (di mana setiap " +
          "hasil kali berupa bilangan untuk suku konstanta, atau bilangan dikali variabel)",
        factorFormText:
          "Ekspresi dituliskan sebagai faktor, yaitu FPB dari suku-suku, dikalikan dengan " +
          "jumlah atau selisih suku-suku yang dituliskan dalam kurung.",
        distributedFormText2: "Bentuk faktor bisa 'diuraikan' dengan mengalikan faktornya dengan setiap suku di dalam kurung.",
        factorFormText2: "Bentuk terdistribusi bisa difaktorkan dalam 4 langkah:",
        summaryInstruction: "Ketuk » untuk melihat langkah-langkah mengubah dari satu bentuk ke bentuk lainnya",
        activityCompleted: "Aktivitas Selesai",
        startOver: "Mulai Ulang"
      }
    }
  };

  window.T = appData[CURRENT_LANGUAGE] || appData.en;
})();
