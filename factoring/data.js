// All copy lives here → window.T. Components read window.T.ui.*.
(() => {
  const CURRENT_LANGUAGE = window.CURRENT_LANGUAGE || "en";

  const appData = {
    en: {
      title: "Factoring an expression — the opposite of distributing",
      ui: {
        exploreButton: "Explore visually",
        next: "»",

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
    }
  };

  window.T = appData[CURRENT_LANGUAGE] || appData.en;
})();
