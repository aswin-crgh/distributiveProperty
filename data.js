// All copy lives here → window.T. Components read window.T.ui.*.
(() => {
  const CURRENT_LANGUAGE = window.CURRENT_LANGUAGE || "en";

  const appData = {
    en: {
      title: "Distributive Property in action",
      ui: {
        exploreButton: "Explore visually",
        next: "»",

        // ---- Scene 1 — intro ----
        introStatement:
          "Performing multiplication alongside addition and<br/>" +
          "subtraction can get easier when we think of<br/>" +
          "rearranging the operations.<br/><br/>" +
          "This is easy to understand when we visualise it!",
        introInstruction: "Tap ‘Explore’ to start",

        // ---- Scene 2 — build numbers ----
        buildHeader1: "Add unit squares to build a number",
        buildHeader2: "Add unit squares to build another number",
        goalMain3: "Make the number ‘3’ using squares",
        goalMain5: "Make the number ‘5’ using squares",
        goalSub: "where each square is a ‘1’",
        valueOnBoard: "value on board = ",
        represents3: "This rectangle<br/>represents 3",
        represents5: "This rectangle<br/>represents 5",
        buildInstruction: "Tap a square to add it to the board",
        arrangeInstruction: "Tap the board to arrange the numbers neatly…",

        // ---- Scene 3-4 — arrange & multiply ----
        boardHas: "The board has 3 + 5",
        multiplyHeader: "Multiply the numbers on the board",
        multiplyText: "multiply the numbers<br/>on the board",
        multiplyBtn: "× 4",
        rectangleIs: "This rectangle is<br/>4 × ( 3 + 5 )",
        rearrangeHeader: "Let’s rearrange the board in different ways…",
        duplicateText: "make a copy of the board<br/>to rearrange it differently",
        duplicateBtn: "Duplicate",
        multiplyInstruction: "Tap the button and observe the board…",
        duplicateInstruction: "Tap the button to duplicate the board",

        // ---- Scene 5 — rearrange ----
        rearrangeInstruction: "Tap the highlighted board to rearrange the rectangles",
        sameValueHeader: "The same value expressed in different ways!",
        relationshipInstruction: "Tap » to explore the relationship",

        // ---- Scene 6 — equation ----
        distributiveBubble: "This is the distributive property of<br/>multiplication over addition!",
        summariseInstruction: "Tap » to see the rule",
        ruleHeader: "Distributive property of multiplication over addition",
        ruleBubble: "PRODUCT of a SUM = SUM of PRODUCTS",
        algebraInstruction: "Tap » to explore the same in algebra",

        // ---- Scene 7 — variable ----
        variableInstruction: "Tap any number in the brackets to make it a variable",
        concludeInstruction: "Tap » to conclude",

        // ---- Scene 8 — summary ----
        summaryHeader: "Distributive property of multiplication",
        summaryText:
          "In Arithmetic and Algebra,<br/>a product of a sum is equal to sum of products!<br/><br/>" +
          "This applies to subtraction as well –<br/>" +
          "product of a difference is equal to difference of products!",
        activityCompleted: "Activity Completed",
        startOver: "Start Over"
      }
    },

    id: {
      title: "Sifat Distributif dalam aksi",
      ui: {
        exploreButton: "Eksplorasi visual",
        next: "»",

        // ---- Scene 1 — intro ----
        introStatement:
          "Perkalian yang digabungkan dengan penjumlahan dan<br/>" +
          "pengurangan bisa menjadi lebih mudah bila kita<br/>" +
          "menata ulang operasinya.<br/><br/>" +
          "Ini mudah dipahami ketika kita<br/>memvisualisasikannya!",
        introInstruction: "Ketuk ‘Eksplorasi’ untuk mulai",

        // ---- Scene 2 — build numbers ----
        buildHeader1: "Tambahkan kotak satuan untuk membentuk bilangan",
        buildHeader2: "Tambahkan kotak satuan untuk membentuk bilangan lain",
        goalMain3: "Bentuk bilangan ‘3’ dengan kotak",
        goalMain5: "Bentuk bilangan ‘5’ dengan kotak",
        goalSub: "setiap kotak bernilai ‘1’",
        valueOnBoard: "nilai di papan = ",
        represents3: "Persegi panjang ini<br/>mewakili 3",
        represents5: "Persegi panjang ini<br/>mewakili 5",
        buildInstruction: "Ketuk sebuah kotak untuk menambahkannya ke papan",
        arrangeInstruction: "Ketuk papan untuk menata bilangan dengan rapi…",

        // ---- Scene 3-4 — arrange & multiply ----
        boardHas: "Papan berisi 3 + 5",
        multiplyHeader: "Kalikan bilangan di papan",
        multiplyText: "kalikan bilangan<br/>di papan",
        multiplyBtn: "× 4",
        rectangleIs: "Persegi panjang ini<br/>4 × ( 3 + 5 )",
        rearrangeHeader: "Mari menata ulang papan dengan berbagai cara…",
        duplicateText: "buat salinan papan<br/>untuk ditata ulang berbeda",
        duplicateBtn: "Gandakan",
        multiplyInstruction: "Ketuk tombol dan amati papan…",
        duplicateInstruction: "Ketuk tombol untuk menggandakan papan",

        // ---- Scene 5 — rearrange ----
        rearrangeInstruction: "Ketuk papan yang disorot untuk menata ulang persegi panjang",
        sameValueHeader: "Nilai yang sama dinyatakan dengan cara berbeda!",
        relationshipInstruction: "Ketuk » untuk menjelajahi hubungannya",

        // ---- Scene 6 — equation ----
        distributiveBubble: "Ini adalah sifat distributif<br/>perkalian terhadap penjumlahan!",
        summariseInstruction: "Ketuk » untuk melihat aturannya",
        ruleHeader: "Sifat distributif perkalian terhadap penjumlahan",
        ruleBubble: "HASIL KALI JUMLAH = JUMLAH HASIL KALI",
        algebraInstruction: "Ketuk » untuk menjelajahi hal yang sama dalam aljabar",

        // ---- Scene 7 — variable ----
        variableInstruction: "Ketuk angka di dalam kurung untuk menjadikannya variabel",
        concludeInstruction: "Ketuk » untuk menyimpulkan",

        // ---- Scene 8 — summary ----
        summaryHeader: "Sifat distributif perkalian",
        summaryText:
          "Dalam Aritmetika dan Aljabar,<br/>hasil kali dari sebuah jumlah sama dengan jumlah dari hasil kali!<br/><br/>" +
          "Ini juga berlaku untuk pengurangan –<br/>" +
          "hasil kali dari sebuah selisih sama dengan selisih dari hasil kali!",
        activityCompleted: "Aktivitas Selesai",
        startOver: "Mulai Ulang"
      }
    }
  };

  window.T = appData[CURRENT_LANGUAGE] || appData.en;
})();
