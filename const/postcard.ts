export const TYPE_INFO = {
  DECISION: {
    label: "Group Decision",
    description:
      "A postcard that helps collect and summarize responses from multiple people to arrive at a shared outcome. Great for group planning (e.g., choosing a restaurant, date, or gift).",
    example:
      "Hey team!\n\nPlease share your preferences for our next team lunch. What restaurant do you prefer? Let’s finalize the decision by Friday.\n\nThanks,\nYour Boss",
  },
  TRIBUTE: {
    label: "Message Tribute",
    description:
      "A collaborative tribute where each participant contributes a heartfelt message. Ideal for birthdays, weddings, farewells, or celebrating someone's achievement.",

    example:
      "Family and friends,\n\nPlease share your favorite memories or messages for Bruce’s birthday tribute. Let’s make it special!\n\nLove,\nEmily",
  },
  RECAP: {
    label: "Thought Recap",
    description:
      "Summarizes what everyone shared in response to a prompt — like reflections after a group trip, a retrospective, or how people felt about a recent event or experience.",

    example:
      "Guys,\n\nPlease share your thoughts on our recent team retreat. What were your key takeaways? Let’s compile a recap to remember the highlights.\n\nCheers,\nAlex",
  },
} as const;
