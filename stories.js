/* Recorded keyframes and descriptions. Image provenance: assets/episodes/provenance.json. */
window.ROBO_WEAVE_STORIES = {
  "A": {
    "instruction": "Find the magazine on the reading-area desk and put it on the coffee table.",
    "task": "am200v1_a001_b2_challenge",
    "steps": [
      {
        "frame": 0,
        "event": 1,
        "kind": "physical",
        "short": "Observe",
        "title": "Start with the available evidence.",
        "caption": "The initial views show the room. The task is to find a magazine and move it to the coffee table.",
        "image": "assets/episodes/a-000.webp",
        "action": "Initial observation",
        "receipt": "No action yet"
      },
      {
        "frame": 13,
        "event": 30,
        "kind": "marker",
        "short": "Select",
        "title": "Select the magazine.",
        "caption": "After changing viewpoint, the agent requests visual targets for a pick action.",
        "image": "assets/episodes/a-013.webp",
        "action": "pick()",
        "receipt": "Select a visible target"
      },
      {
        "frame": 14,
        "event": 33,
        "kind": "physical",
        "short": "Pick",
        "title": "Pick up the selected object.",
        "caption": "The magazine is visible in the wrist view after the pick call returns completed.",
        "image": "assets/episodes/a-014.webp",
        "action": "pick(target=1)",
        "receipt": "Action completed"
      },
      {
        "frame": 20,
        "event": 47,
        "kind": "transient",
        "short": "Feedback",
        "title": "A placement can fall short.",
        "caption": "The first placement attempt returns placement_collision_blocked. The magazine remains held.",
        "image": "assets/episodes/a-020.webp",
        "action": "place_on_top(target=6)",
        "receipt": "Placement blocked · collision"
      },
      {
        "frame": 23,
        "event": 56,
        "kind": "physical",
        "short": "Adapt",
        "title": "Choose another placement.",
        "caption": "A later placement targets a different area of the coffee table and returns completed.",
        "image": "assets/episodes/a-023.webp",
        "action": "place_on_top(target=3)",
        "receipt": "Action completed"
      }
    ]
  },
  "M": {
    "instruction": "Temporarily move the milk cartons from the dining table to the counter. Put the item originally on the counter onto the dining table, then return the item originally from the dining table there as well. Leave both there.",
    "task": "mnext120_m1_01_w0_challenge",
    "steps": [
      {
        "frame": 0,
        "event": 1,
        "kind": "physical",
        "short": "Observe",
        "title": "Remember the starting arrangement.",
        "caption": "The instruction identifies the milk cartons by their original locations on the dining table and counter.",
        "image": "assets/episodes/m-000.webp",
        "action": "Initial observation",
        "receipt": "No action yet"
      },
      {
        "frame": 21,
        "event": 64,
        "kind": "physical",
        "short": "Move",
        "title": "Make the temporary move.",
        "caption": "The table-origin carton is placed on the counter. Current location now differs from its original role.",
        "image": "assets/episodes/m-021.webp",
        "action": "place_on_top(target=2)",
        "receipt": "Action completed"
      },
      {
        "frame": 23,
        "event": 70,
        "kind": "physical",
        "short": "Recall",
        "title": "Select by original location.",
        "caption": "The next pick selects the item that originally belonged on the counter.",
        "image": "assets/episodes/m-023.webp",
        "action": "pick(target=1)",
        "receipt": "Action completed"
      },
      {
        "frame": 28,
        "event": 85,
        "kind": "physical",
        "short": "Place",
        "title": "Move the counter-origin item.",
        "caption": "The selected item is placed on the dining table, as required by the task.",
        "image": "assets/episodes/m-028.webp",
        "action": "place_on_top(target=5)",
        "receipt": "Action completed"
      },
      {
        "frame": 33,
        "event": 100,
        "kind": "physical",
        "short": "Return",
        "title": "Return the table-origin carton.",
        "caption": "The final recorded placement returns the temporarily moved carton to the dining table.",
        "image": "assets/episodes/m-033.webp",
        "action": "place_on_top(target=3)",
        "receipt": "Action completed"
      }
    ]
  },
  "P": {
    "instruction": "Place the soap dispenser onto whichever of the two supports on the table is appropriate.",
    "task": "p50_support_009_20260914",
    "steps": [
      {
        "frame": 0,
        "event": 1,
        "kind": "physical",
        "short": "Observe",
        "title": "Inspect the available supports.",
        "caption": "The task asks for the soap dispenser to be placed on whichever of two supports is appropriate.",
        "image": "assets/episodes/p-000.webp",
        "action": "Initial observation",
        "receipt": "No action yet"
      },
      {
        "frame": 4,
        "event": 9,
        "kind": "physical",
        "short": "Inspect",
        "title": "Change viewpoint before acting.",
        "caption": "The agent turns to inspect the scene before requesting a pick action.",
        "image": "assets/episodes/p-004.webp",
        "action": "turn_left(repeat=3)",
        "receipt": "Action completed"
      },
      {
        "frame": 6,
        "event": 15,
        "kind": "physical",
        "short": "Pick",
        "title": "Pick up the soap dispenser.",
        "caption": "The selected dispenser is held after the pick action returns completed.",
        "image": "assets/episodes/p-006.webp",
        "action": "pick(target=1)",
        "receipt": "Action completed"
      },
      {
        "frame": 11,
        "event": 26,
        "kind": "marker",
        "short": "Select",
        "title": "Select the metal tray.",
        "caption": "The placement call selects the metal tray, then presents candidate surface locations.",
        "image": "assets/episodes/p-011.webp",
        "action": "place_on_top(target=2)",
        "receipt": "Select a visible target"
      },
      {
        "frame": 12,
        "event": 29,
        "kind": "physical",
        "short": "Place",
        "title": "Place on the selected surface.",
        "caption": "Placement targets the central surface of the metal tray and returns completed.",
        "image": "assets/episodes/p-012.webp",
        "action": "place_on_top(target=4)",
        "receipt": "Action completed"
      }
    ]
  },
  "V": {
    "instruction": "Close the microwave door.",
    "task": "v_r1_b340e1bfb7224624bb7a",
    "steps": [
      {
        "frame": 0,
        "event": 1,
        "kind": "physical",
        "short": "Observe",
        "title": "Begin with the door open.",
        "caption": "The task is to close the microwave door.",
        "image": "assets/episodes/v-000.webp",
        "action": "Initial observation",
        "receipt": "No action yet"
      },
      {
        "frame": 1,
        "event": 4,
        "kind": "marker",
        "short": "Select",
        "title": "Select the microwave door.",
        "caption": "A close request returns visual target markers for the door.",
        "image": "assets/episodes/v-001.webp",
        "action": "close()",
        "receipt": "Select a visible target"
      },
      {
        "frame": 2,
        "event": 7,
        "kind": "physical",
        "short": "Inspect",
        "title": "Inspect after the disturbance.",
        "caption": "The first close call returns completed. An experimental intervention reopens the door before this observation.",
        "image": "assets/episodes/v-002.webp",
        "action": "close(target=1)",
        "receipt": "Action completed"
      },
      {
        "frame": 3,
        "event": 10,
        "kind": "marker",
        "short": "Recover",
        "title": "Request another closing action.",
        "caption": "A second close request selects the microwave door again, rather than assuming the earlier action finished the task.",
        "image": "assets/episodes/v-003.webp",
        "action": "close()",
        "receipt": "Select a visible target"
      },
      {
        "frame": 4,
        "event": 13,
        "kind": "physical",
        "short": "Check",
        "title": "Close the door again.",
        "caption": "The second closing call returns completed; the recorded view shows the closed microwave door.",
        "image": "assets/episodes/v-004.webp",
        "action": "close(target=1)",
        "receipt": "Action completed"
      }
    ]
  }
};
