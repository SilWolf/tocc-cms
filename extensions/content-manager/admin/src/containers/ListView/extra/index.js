import { gameTabsWithComponent } from "./apis/game";

function extraTabsWithComponent({ slug }) {
  switch (slug) {
    case "application::game.game":
      return gameTabsWithComponent;
  }

  return {};
}

export default extraTabsWithComponent;
