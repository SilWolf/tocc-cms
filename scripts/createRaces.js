const faker = require("faker");
const axios = require("axios").default;

const api = axios.create({
  baseURL: "http://localhost:1337",
});
api.interceptors.response.use((response) => response.data);

const parentRacesData = [
  { name: "人類", nameEn: "Human", code: "race:human" },
  { name: "精靈", nameEn: "Elf", code: "race:elf" },
  { name: "矮人", nameEn: "Dwarf", code: "race:dwarf" },
  { name: "半精靈", nameEn: "Half-elf", code: "race:half-elf" },
  { name: "半獸人", nameEn: "Half-orc", code: "race:half-orc" },
  { name: "龍裔", nameEn: "Dragonborn", code: "race:dragonborn" },
  { name: "半身人", nameEn: "Halfling", code: "race:halfling" },
  { name: "提夫林", nameEn: "Tiefling", code: "race:tiefling" },
  { name: "侏儒", nameEn: "Gnome", code: "race:gnome" },
  { name: "斑貓人", nameEn: "Tabaxi", code: "race:tabaxi" },
  { name: "蜥蜴人", nameEn: "Lizardfolk", code: "race:lizardfolk" },
  { name: "天狗", nameEn: "Kenku", code: "race:kenku" },
  { name: "狗頭人", nameEn: "Kobold", code: "race:kobold" },
];

const racesData = [
  {
    name: "人類",
    nameEn: "Human",
    code: "race:human",
    mainRaceCode: "mainRace:human",
  },
  {
    name: "變種人類",
    nameEn: "Variant Human",
    code: "race:variant-human",
    mainRaceCode: "mainRace:human",
  },
  {
    name: "木精靈",
    nameEn: "Wood Elf",
    code: "race:wood-elf",
    mainRaceCode: "mainRace:elf",
  },
  {
    name: "卓爾精靈",
    nameEn: "Drow",
    code: "race:drow",
    mainRaceCode: "mainRace:elf",
  },
  {
    name: "高等精靈",
    nameEn: "High Elf",
    code: "race:high-elf",
    mainRaceCode: "mainRace:elf",
  },
  {
    name: "山地矮人",
    nameEn: "Mountain Dwarf",
    code: "race:mountain-dwarf",
    mainRaceCode: "mainRace:dwarf",
  },
  {
    name: "丘陵矮人",
    nameEn: "Hill Dwarf",
    code: "race:hill-dwarf",
    mainRaceCode: "mainRace:dwarf",
  },
  {
    name: "半精靈",
    nameEn: "Half-elf",
    code: "race:half-elf",
    mainRaceCode: "mainRace:half-elf",
  },
  {
    name: "半獸人",
    nameEn: "Half-orc",
    code: "race:half-orc",
    mainRaceCode: "mainRace:half-orc",
  },
  {
    name: "黑龍裔",
    nameEn: "Black Dragonborn",
    code: "race:black-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "藍龍裔",
    nameEn: "Blue Dragonborn",
    code: "race:blue-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "黃銅龍裔",
    nameEn: "Brass Dragonborn",
    code: "race:brass-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "青銅龍裔",
    nameEn: "Bronze Dragonborn",
    code: "race:bronze-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "赤銅龍裔",
    nameEn: "Copper Dragonborn",
    code: "race:copper-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "金龍裔",
    nameEn: "Gold Dragonborn",
    code: "race:gold-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "綠龍裔",
    nameEn: "Green Dragonborn",
    code: "race:green-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "紅龍裔",
    nameEn: "Red Dragonborn",
    code: "race:red-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "銀龍裔",
    nameEn: "Silver Dragonborn",
    code: "race:silver-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "白龍裔",
    nameEn: "White Dragonborn",
    code: "race:white-dragonborn",
    mainRaceCode: "mainRace:dragonborn",
  },
  {
    name: "輕足半身人",
    nameEn: "Lightfoot Halfling",
    code: "race:lightfoot-halfling",
    mainRaceCode: "mainRace:halfling",
  },
  {
    name: "強魄半身人",
    nameEn: "Stout Halfling",
    code: "race:stout-halfling",
    mainRaceCode: "mainRace:halfling",
  },
  {
    name: "提夫林",
    nameEn: "Tiefling",
    code: "race:tiefling",
    mainRaceCode: "mainRace:tiefling",
  },
  {
    name: "岩侏儒",
    nameEn: "Rock Gnome",
    code: "race:rock-gnome",
    mainRaceCode: "mainRace:gnome",
  },
  {
    name: "林侏儒",
    nameEn: "Forest Gnome",
    code: "race:forest-gnome",
    mainRaceCode: "mainRace:gnome",
  },
  {
    name: "斑貓人",
    nameEn: "Tabaxi",
    code: "race:tabaxi",
    mainRaceCode: "mainRace:tabaxi",
  },
  {
    name: "蜥蜴人",
    nameEn: "Lizardfolk",
    code: "race:lizardfolk",
    mainRaceCode: "mainRace:lizardfolk",
  },
  {
    name: "天狗",
    nameEn: "Kenku",
    code: "race:kenku",
    mainRaceCode: "mainRace:kenku",
  },
  {
    name: "狗頭人",
    nameEn: "Kobold",
    code: "race:kobold",
    mainRaceCode: "mainRace:kobold",
  },
];

const nextBirthday = (dateString) => {
  try {
    const date = new Date(dateString);
    if (!date) {
      return dateString;
    }

    const now = new Date();

    date.setFullYear(now.getFullYear());
    if (date.getTime() < now.getTime()) {
      date.setFullYear(now.getFullYear() + 1);
    }

    return date.toISOString();
  } catch (e) {
    return dateString;
  }
};

const agent = {
  id: "61246074573c87dd6519f80f",
};

(async () => {
  // BI. create labels
  let labels = await api.get(`/labels?agent=${agent}`);
  if (!labels || labels.length === 0) {
    labels = await Promise.all(
      [
        "dog lover",
        "cat lover",
        "golf lover",
        "wine lover",
        "party lover",
        "car lover",
        "travel lover",
        "single",
        "married",
        "has daughter",
        "has son",
        "live with parents",
        "car owner",
        "ship owner",
        "plane onwer",
        "chronically ill",
        "high-risk job",
        "business owner",
      ].map((word) => {
        return api
          .post("/labels", {
            name: word,
            color: faker.internet.color(),
            agent: agent.id,
          })
          .then((label) => {
            console.log(`Label ${label.name} created.`);
            return label;
          });
      })
    );
  }

  // BII.a. create orders type
  let orderTypes = await api.get(`/order-types?agent=${agent}`);
  if (!orderTypes || orderTypes.length === 0) {
    orderTypes = await Promise.all(
      [
        "Life Insurance",
        "Accidental Death Insurance",
        "Health Insurrance",
        "Tranvel Insurance",
        "Car Insurance",
      ].map((word) => {
        return api
          .post("/order-types", {
            name: word,
            color: faker.internet.color(),
            agent: agent.id,
          })
          .then((orderType) => {
            console.log(`Order type ${orderType.name} created.`);
            return orderType;
          });
      })
    );
  }

  // BII.b. create orders status
  let orderStatuses = await api.get(`/order-statuses?agent=${agent}`);
  if (!orderStatuses || orderStatuses.length === 0) {
    orderStatuses = await Promise.all(
      [
        { name: "pending", color: "#e3687b" },
        { name: "payment", color: "#dea131" },
        { name: "active", color: "#54de59" },
        { name: "need discuss" },
        { name: "new" },
        { name: "trans" },
        { name: "terminate" },
      ].map(({ name, color }) => {
        return api
          .post("/order-statuses", {
            name: name,
            color: color || faker.internet.color(),
            agent: agent.id,
          })
          .then((orderStatus) => {
            console.log(`Order type ${orderStatus.name} created.`);
            return orderStatus;
          });
      })
    );
  }

  const clients = await Promise.all(
    Array(faker.datatype.number({ min: 70, max: 90 }))
      .fill(undefined)
      .map((_, ci) => {
        const dob = faker.date
          .past(60, new Date(2000, 1, 1))
          .toISOString()
          .substr(0, 10);

        return api
          .post("/clients", {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            portraitImage:
              Math.random() < 0.5
                ? {
                    url: `https://placedog.net/300?id=${ci}`,
                    formats: {
                      thumbnail: `https://placedog.net/120?id=${ci}`,
                      small: `https://placedog.net/300?id=${ci}`,
                      medium: `https://placedog.net/600?id=${ci}`,
                    },
                  }
                : undefined,
            phone: `+852${faker.datatype.number({
              min: 10000000,
              max: 99999999,
            })}`,
            email: faker.internet.email(),
            company: faker.company.companyName(),
            job: faker.name.jobTitle(),
            dob: dob,
            nextBirthdayAt: nextBirthday(dob),
            lastContactAt:
              Math.random() < 0.5
                ? undefined
                : faker.date.past(20, new Date()).toISOString(),
            nextContactAt:
              Math.random() < 0.8
                ? undefined
                : faker.date.future(1, new Date()).toISOString(),
            labels: faker.random
              .arrayElements(labels, faker.datatype.number({ min: 2, max: 6 }))
              .map((label) => label.id),
            provider: faker.random.arrayElement([
              "faker_google",
              "faker_whatsapp",
              "faker_custom",
            ]),

            agent: agent.id,
          })
          .then((client) => {
            console.log(
              `Client ${client.firstName} ${client.lastName} created.`
            );
            return client;
          });
      })
  );

  for (const client of clients) {
    const orders = await Promise.all(
      Array(faker.datatype.number({ min: 0, max: 4 }))
        .fill(undefined)
        .map(() => {
          return api
            .post("/orders", {
              orderType: faker.random.arrayElement(orderTypes).id,
              orderStatus: faker.random.arrayElement(orderStatuses).id,
              client: client.id,
              agent: agent.id,
            })
            .then((order) => {
              console.log(`Order ${order.id} created.`);
              return order;
            });
        })
    );

    const events = await Promise.all(
      Array(faker.datatype.number({ min: 0, max: 8 }))
        .fill(undefined)
        .map(() =>
          faker.date
            .between(new Date(2014, 1, 1), new Date(2022, 12, 31))
            .toISOString()
        )
        .sort()
        .map((date) => {
          const startAt = new Date(date);
          startAt.setMinutes(faker.datatype.number({ min: 0, max: 11 }) * 5);
          startAt.setSeconds(0);

          const endAt = new Date(startAt);
          endAt.setMinutes(
            endAt.getMinutes() + faker.datatype.number({ min: 2, max: 16 }) * 15
          );

          return api
            .post("/events", {
              title: faker.lorem.words(
                faker.datatype.number({ min: 2, max: 4 })
              ),
              description: faker.lorem.paragraph(),
              startAt: startAt.toISOString(),
              endAt: endAt.toISOString(),
              type: faker.random.arrayElement(["faker_event", "faker_contact"]),
              location:
                Math.random() < 0.5 ? undefined : faker.address.streetAddress(),
              order:
                Math.random() < 0.5
                  ? undefined
                  : faker.random.arrayElement(orders)?.id,
              client: client.id,
              agent: agent.id,
            })
            .then((event) => {
              console.log(`Event ${event.title} created.`);
              return event;
            });
        })
    );

    // BIII. create notes
    await Promise.all(
      Array(faker.datatype.number({ min: 0, max: 8 }))
        .fill(undefined)
        .map(() => {
          return api
            .post("/notes", {
              description: faker.lorem.paragraph(),
              order:
                Math.random() < 0.2
                  ? undefined
                  : faker.random.arrayElement(orders)?.id,
              client: client.id,
              agent: agent.id,
              createdAt: faker.date
                .between(new Date(2014, 1, 1), new Date(2021, 6, 1))
                .toISOString(),
            })
            .then((note) => {
              console.log(`Note ${note.id} created.`);
              return note;
            });
        })
    );

    await api
      .post("/events", {
        title: "Birthday",
        description: faker.lorem.paragraph(),
        startAt: client.nextBirthdayAt,
        type: "faker_birthday",
        client: client.id,
        agent: agent.id,
      })
      .then((event) => {
        console.log(`Event ${event.title} created.`);
        return event;
      });

    if (client.lastContactAt) {
      await api
        .post("/events", {
          title: "Regular Contact",
          description: faker.lorem.paragraph(),
          startAt: client.lastContactAt,
          type: "faker_contact",
          client: client.id,
          agent: agent.id,
        })
        .then((event) => {
          console.log(`Event ${event.title} created.`);
          return event;
        });
    }

    if (client.nextContactAt) {
      await api
        .post("/events", {
          title: "Regular Contact",
          description: faker.lorem.paragraph(),
          startAt: client.nextContactAt,
          type: "faker_contact",
          client: client.id,
          agent: agent.id,
        })
        .then((event) => {
          console.log(`Event ${event.title} created.`);
          return event;
        });
    }
  }
})();
