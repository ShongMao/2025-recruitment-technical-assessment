import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = null;

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.replace(/[-_]/g, ' ');
  recipeName = recipeName.replace(/\s+/g, ' ').trim();
  recipeName = recipeName.replace(/[^a-zA-Z]/g, '');
  recipeName = recipeName.replace(/\b\w/g, char => char.toUpperCase());
  if (recipeName.length <= 0) {
    return null;
  }
  return recipeName;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook

app.post("/entry", (req:Request, res:Response) => {
  if (req.body.type !== "recipe" && req.body.type !== "ingredient") {
    return res.status(400);
  } else if (req.body.cookTime < 0) {
    return res.status(400);
  } 
  
  for (const item of cookbook) {
    if ((req.body.name) === item.name) {
      return res.status(400);
    }
  }

  if (req.body.type === 'recipe') {
    const seenIngredients: string[] = [];
    for (const ingredient of req.body.requiredItems) {
      if (seenIngredients.includes(ingredient.name)) {
        return res.status(400);
      } else {
        seenIngredients.push(ingredient.name);
      }
    }
  }
  cookbook.push(req.body);
  res.status(200);
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  const summary: any = null;
  summary.ingredients = [];
  
  if (req.body.type === 'recipe' && cookbook.find((item) => item.name === 
  req.body.name) === false) {
    return res.status(400);
  } 
  let totalCookTime = 0;
  for (const item of req.body.requiredItems) {
    if (cookbook.includes(item.name) === false) {
      return res.status(400);
    } else {
      totalCookTime += item.quantity // * cooktime.;
      summary.ingredients.push(/*{ name: item.name, quantity: item.quantity}*/);
    }
  }
  summary.name = req.body.name, 
  summary.cookTime = totalCookTime;

  res.status(200);
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
