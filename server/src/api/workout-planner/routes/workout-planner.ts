export default {
  routes: [
    {
      method: "POST",
      path: "/workout-planner",
      handler: "workout-planner.generate",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/workout-planner/regenerate",
      handler: "workout-planner.regenerate",
      config: {
        auth: false,
      },
    },
  ],
};
