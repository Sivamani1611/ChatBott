// Import necessary components and types
import ChatBot from "./components/ChatBot";
import { Params } from "./types/Params";
import { useState } from "react";

// Power BI links and filter-related functions
const powerBILinks: { [key: string]: string } = {
  "sales_revenue":
    "https://app.powerbi.com/groups/me/reports/07353a90-7b2a-44fe-92d3-d6b8565fa43e/ReportSection8da7d6bdc07307d92cd8?experience=power-bi",
  "production":
    "https://app.powerbi.com/groups/me/reports/b5d3ec85-a88d-4241-8dca-61c3852e3f66/ReportSection0b965e5f0ff4c1d12917?experience=power-bi",
  "cost_analysis":
    "https://app.powerbi.com/groups/me/reports/b5d3ec85-a88d-4241-8dca-61c3852e3f66/ReportSection76e661661e1efa82616c?experience=power-bi",
  "raw_material":
    "https://app.powerbi.com/groups/me/reports/b5d3ec85-a88d-4241-8dca-61c3852e3f66/ReportSectionfbdc3e3fdaae956b9024?experience=power-bi",
};

const filterKeywords: { [key: string]: string[] } = {
  raw_material: ["Plant"],
  sales_revenue: ["Company", "Segment", "Sales Group", "Year"],
};

const filterValues = {
  "raw_material": {
    Plant: [
      "Anara",
      "BBSR",
      "Bhurwal",
      "BLSPR CP",
      "BLSPR LL",
      "Gaya",
      "Hubli",
      "Mirza",
      "Pathri",
      "Sholaka",
      "TMQ",
      "Udvada",
      "Wadiyaram",
    ],
  },
  "sales_revenue": {
    Company: ["DEW", "ICON", "PRIL"],
    Segment: ["Select all", "Other Sales", "Sleeper"],
    "Sales Group": [
      "Asset Sales",
      "Scrap Sales",
      "Sleeper Sales",
      "Sleeper Transportation Income",
      "Traded Goods Sales",
    ],
    Year: ["2022", "2023"],
  },
};

const getPowerBILink = (name:string) => {
  return powerBILinks[name] || null;
};

const getFilters = (name, filterText) => {
  let filtersToReturn = [];
  const availableFilters = filterKeywords[name].map((filter) =>
    filter.toLowerCase(),
  );
  for (let i = 0; i < availableFilters.length; i++) {
    if (filterText.toLowerCase().includes(availableFilters[i])) {
      filtersToReturn.push(filterKeywords[name][i]);
    }
  }
  return filtersToReturn;
};

const getFilterValues = (name, filterName, filterText) => {
  const filterValuesToReturn = [];
  const availableFilterValues = filterValues[name][filterName].map(
    (filterValue) => filterValue.toLowerCase(),
  );
  for (let i = 0; i < availableFilterValues.length; i++) {
    if (filterText.toLowerCase().includes(availableFilterValues[i])) {
      filterValuesToReturn.push(filterValues[name][filterName][i]);
    }
  }
  return filterValuesToReturn;
};

const addFilters = (link, tableName, filterName, filterValues) => {
  if (filterValues.length === 1) {
    return `${link}&filter=${tableName}/${filterName} eq '${filterValues[0]}'`;
  } else if (filterValues.length > 1) {
    const filterList = filterValues.map((value) => `'${value}'`).join(",");
    return `${link}&filter=${tableName}/${filterName} in (${filterList})`;
  }
  return link;
};

// App component
function App() {
  const [state, setState] = useState({
    name: "",
    type: "",
  });

  console.log(state);

  // Updated chat flow
  const flow = {
    start: {
      message:
        "Hello! Welcome to the Dashboard ChatBot. Please choose a dashboard:",
      options: ["Sales Revenue", "Cost Analysis", "Production", "Raw Material"],
      path: (params: Params) => {
        setState({
          ...state,
          name: params.userInput
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(".", ""),
        });
        return params.userInput
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(".", "");
      },
    },

    sales_revenue: {
      message: "Great choice! Please select a filter option:",
      options: filterKeywords[state.name],
      path: (params: Params) => {
        setState({
          ...state,
          type: params.userInput.toLowerCase().replace(/\s+/g, "_"),
        });
        return "please_wait_sales_revenue";
      },
    },

    cost_analysis: {
      message: "Sure thing! Please choose a filter option:",
      options: filterKeywords[state.name],
      path: (params: Params) => {
        setState({
          ...state,
          type: params.userInput.toLowerCase().replace(/\s+/g, "_"),
        });
        return "please_wait_cost_analysis";
      },
    },

    production: {
      message: "Excellent! Select a filter option for production:",
      options: filterKeywords[state.name],
      path: (params: Params) => {
        setState({
          ...state,
          type: params.userInput.toLowerCase().replace(/\s+/g, "_"),
        });
        return "please_wait_production";
      },
    },

    raw_material: {
      message: "Awesome! Choose a filter option for raw material:",
      options: filterKeywords[state.name],
      path: (params: Params) => {
        setState({
          ...state,
          type: params.userInput.toLowerCase().replace(/\s+/g, "_"),
        });
        return "please_wait_raw_material";
      },
    },

    please_wait_sales_revenue: {
      message: "Please wait while we fetch sales revenue data...",
      transition: { duration: 2000 },
      path: (params: Params) => {
        const powerBILink = getPowerBILink(state.name);
        if (powerBILink) {
          const filterName = getFilters(state.name, params.userInput)[0];
          const filterValues = getFilterValues(
            state.name,
            filterName,
            params.userInput,
          );
          const newLink = addFilters(
            powerBILink,
            "PRILFY2023",
            filterName,
            filterValues,
          );
          console.log(newLink);
          const newWindow = window.open(newLink, "_blank");
          // Update link in the new window
          newWindow.location.href = newLink;
          return "end";
        } else {
          return "unknown_dashboard";
        }
      },
    },

    please_wait_cost_analysis: {
      message: "Please wait while we fetch cost analysis data...",
      transition: { duration: 2000 },
      path: (params: Params) => {
        const powerBILink = getPowerBILink(state.name);
        if (powerBILink) {
          const filterName = getFilters(state.name, params.userInput)[0];
          const filterValues = getFilterValues(
            state.name,
            filterName,
            params.userInput,
          );
          const newLink = addFilters(
            powerBILink,
            "CostAnalysisTable",
            filterName,
            filterValues,
          );
          const newWindow = window.open(newLink, "_blank");
          // Update link in the new window
          newWindow.location.href = newLink;
          return "end";
        } else {
          return "unknown_dashboard";
        }
      },
    },

    please_wait_production: {
      message: "Please wait while we fetch production data...",
      transition: { duration: 2000 },
      path: (params: Params) => {
        const powerBILink = getPowerBILink(state.name);
        if (powerBILink) {
          const filterName = getFilters(state.name, params.userInput)[0];
          const filterValues = getFilterValues(
            state.name,
            filterName,
            params.userInput,
          );
          const newLink = addFilters(
            powerBILink,
            "ProductionTable",
            filterName,
            filterValues,
          );
          const newWindow = window.open(newLink, "_blank");
          // Update link in the new window
          newWindow.location.href = newLink;
          return "end";
        } else {
          return "unknown_dashboard";
        }
      },
    },

    please_wait_raw_material: {
      message: "Please wait while we fetch raw material data...",
      transition: { duration: 2000 },
      path: (params: Params) => {
        const powerBILink = getPowerBILink(state.name);
        if (powerBILink) {
          const filterName = getFilters(state.name, params.userInput)[0];
          const filterValues = getFilterValues(
            state.name,
            filterName,
            params.userInput,
          );
          const newLink = addFilters(
            powerBILink,
            "RawMaterialTable",
            filterName,
            filterValues,
          );
          const newWindow = window.open(newLink, "_blank");
          // Update link in the new window
          newWindow.location.href = newLink;
          return "end";
        } else {
          return "unknown_dashboard";
        }
      },
    },

    unknown_dashboard: {
      message: "Sorry, I didn't recognize that dashboard. Please try again.",
      path: "end",
    },

    end: {
      message: "Thank you for using the Dashboard ChatBot! Have a great day!",
      path: "loop",
    },

    loop: {
      message: "You have reached the end of the conversation!",
      path: "loop",
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: `calc(20vh)`,
          }}
        >
          <ChatBot
            flow={flow}
            options={{
              audio: { disabled: false },
              chatInput: { botDelay: 1000 },
              userBubble: { showAvatar: true },
              botBubble: { showAvatar: true },
              voice: { disabled: false },
            }}
          ></ChatBot>
        </div>
      </header>
    </div>
  );
}

export default App;
