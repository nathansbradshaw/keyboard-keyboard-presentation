# That Time We Turned an IBM Model M into a MIDI Instrument

## Talk at a glance

**Core story:** We wanted to build something strange enough to meet Mark Rober, so we turned an IBM Model M into a velocity-sensitive MIDI instrument. Doing that forced software, electronics, mechanics, real-time firmware, protocol design, and music theory into one system.

**Thesis:** Constraints are not just obstacles to engineering. They shape the expression of the thing being built. The best way for a software engineer to feel that is to build something whose bugs are physical.

**Audience promise:** By the end of the talk, the audience should understand:

1. How a key press becomes a velocity-sensitive musical event.
2. How to move from an idea to a fabricated and debugged PCB.
3. How real-time firmware separates sensing, interpretation, and transport.
4. Why MIDI carries performance instructions rather than sound.
5. Why an isomorphic note layout makes an old computer keyboard a new instrument.
6. Why a working prototype is still a long way from a product.

**Recurring narrative device:** Software-engineer audience characters interrupt the story six times to ask what the audience may be thinking:

- Why should I care?
- How do I build one?
- The checks passed, so it works—right?
- How do I program it?
- Where does the sound come from?
- Can we sell it?

**Current runtime:** The per-slide timing metadata totals approximately **38:35**, including the seven-minute live-demo block and excluding audience laughter, transitions, or questions. A natural delivery should land around 40–45 minutes.

## Run of show

| Section | Slides | Target | Job in the story |
| --- | ---: | ---: | --- |
| Prologue and discovery | 1–9 | 5:00 | Establish the quest, introduce the Model M, commit to the dangerous design path, and discover and resolve velocity sensing. |
| Why this matters | 10–15 | 2:30 | Connect embedded constraints to software engineering, answer how to begin, and turn the project’s open-source parents into a reusable, licensed build recipe. |
| Plan and de-risk the board | 16–19 | 2:15 | Preview the KiCad journey, select viable parts, verify their contracts, and prove the sensing physics. |
| From schematic to working PCB | 20–30 | 6:35 | Turn the validated design into schematics, PCB layout, manufacturing files, physical evidence, and working repairs. |
| From board to key event | 31–42 | 6:50 | Explain the embedded build, real-time scan, calibration, filtering, state, queues, and observability. |
| From event to MIDI cable | 43–47 | 2:45 | Separate instructions from audio and trace one NoteOn to DIN MIDI. |
| From key grid to instrument | 48–51 | 2:20 | Explain the Wicki–Hayden relationship and the payoff of movable interval shapes. |
| Prototype, demo, and finale | 52–58 | 10:20 | Confront production reality, prove the instrument live, return to the quest, close, and leave resources on screen. |

---

## 1. Prologue and discovery — slides 1–9

**Section question:** How do you make a computer keyboard expressive enough to become a musical instrument?

**Narrative movement:** A failed quest produces a new challenge. The Model M supplies a memorable physical object, but its single digital click cannot reveal how hard a key was played. Two discoveries—stacked switches and Hall sensing—change the problem from detecting a press to measuring motion, then Hall sensing resolves piano and forte.

1. **That Time We Turned an IBM Model M into a MIDI Instrument**
   Introduce electroNuck and N8, show the finished object, and state that this is the second attempt to build something interesting enough to meet Mark Rober. Do not explain the implementation yet.

2. **Last Time On…**
   Recap Open Sauce, the Synthphone-e, meeting ThePrimeagen, and failing to meet Mark Rober. This creates continuity and gives the new build an emotional objective.

3. **The Quest**
   State the objective—build something cool enough to meet Mark Rober—and let “unknown difficulty,” “non-existent budget,” and “expanding scope” establish the tone.

4. **A New Challenger Appears**
   Reveal the stock IBM Model M like a boss character.

5. **How Do You Make a Keyboard Sing?**
   Contrast the easy path, USB-to-MIDI conversion, with the dangerous path, building MIDI into the keyboard. Then reveal the real acceptance criterion: it must respond to piano and forte.

6. **Interlude: You Can’t Just Build MIDI into It**
   Give the dangerous choice its own romantic-comedy beat. Lovestruck Mio points at the keyboard and stammers, “R-Ren-senpai… T-that’s a Model M! You can’t just—” Reveal Ren calmly holding a screwdriver for “Of course I can.” Then change Mio into an arms-folded, eyes-averted pout for her tiny “B-Baka…” and land the Option B stamp. Keep the finished keyboard visible so the joke has an unmistakable referent.

7. **One Satisfying Click Too Few**
   Explain the buckling spring. One click produces one switch event, which tells us that a key was pressed but not how quickly it moved.

8. **Two Clues Changed the Question**
   Show the two separate discoveries. Melodicade MX suggests estimating speed from two switch events over a known distance. Hall-effect switches expose continuous key travel. Together they change the question from “did it click?” to “how did it move?”

9. **Piano / Forte Solved**
   Explain the central sensing idea immediately after its discovery. Choose two fixed Hall-sensor positions, measure the elapsed time between them, and map a slow crossing to low velocity and a fast crossing to high velocity.

**Handoff:** The sensing problem is solved. Before following the build, answer why a software audience should care.

## 2. Why this matters — slides 10–15

**Section question:** What does an enterprise software engineer gain by caring about embedded systems and custom hardware?

**Narrative movement:** The first audience interruption forces the talk to state its thesis. Constraints make systems expressive. A second interruption asks how to begin, prompting the reveal of the project’s open-source parents and the license rules that make the approach reusable.

10. **Interruption: Why Should I Care?**
   Voice the skeptical enterprise developer: “I build banking software. Why should I care about embedded systems or this keyboard?” Let the objection hang before answering it.

11. **The Constraint Is the Expression**
   Compare pixel art, chiptune, and embedded systems. Their limits are not incidental; they create the character of the result. Introduce the project’s particular medium: an old shell, one hundred analog sensors, a one-millisecond scan, and DIN MIDI.

12. **Interruption: How Do I Build One?**
   Change the audience character from skeptical to curious. Answer with the actionable starting point: begin from a proven open-hardware design, then reveal the two projects that provided the mechanical and electrical foundations.

13. **We Do Not Have to Start from Zero**
   Introduce the two open-source parents: mod-mmm for the Model M mechanical starting point and HE60 for a Hall-effect electrical reference. The finished board adapts both rather than copying either wholesale.

14. **Copy the Homework; Read the License**
   Explain open hardware as permission to study, modify, make, and share source designs under explicit terms. Kaori’s “Ara ara…” warning makes reading the exact license the comedic threat and the real rule.

15. **An Audio Amplifier Design That Can Legally Be Stolen**
   Make the license lesson concrete with the SparkFun BOB-11044. Trace a functional block from certified source into real CAD, validate it against the datasheet, adapt it to the system, and preserve the required notices.

**Handoff:** With licensed references established, show the toolchain that will turn them into a physical board.

## 3. Plan and de-risk the board — slides 16–19

**Section question:** What route takes an open design into KiCad, and which assumptions must be eliminated before drawing the schematic?

**Narrative movement:** Preview the complete KiCad route from schematic to PCB to Gerbers. Before entering the first editor, turn requirements into a short component list, verify each candidate against primary documentation, and prove the riskiest physical behavior with one end-to-end key.

16. **The KiCad Roadmap**
   Preview the three representations of one design: schematic for logic, PCB for physical implementation, and Gerbers for manufacturing. Then pause before the schematic to complete the electronics preflight.

17. **Eliminate 997 Parts**
   Convert the design into catalog filters: voltage, output type, sensitivity, package, stock, assembly support, and quantity price. Show the factual result—one hundred MT9105ET linear Hall sensors—rather than an unrelated keyboard PCB.

18. **The Datasheet Is the Source Code**
   Treat the datasheet as the component contract: behavior, electrical boundaries, wiring, package, sensing location, and pin-to-footprint agreement. Close with “Datasheet-sama has spoken.”

19. **Prove One Key Before Buying One PCB**
   Show the actual five-key breadboard proof of concept. Retire the riskiest assumption by measuring the full path from key motion to a MIDI note before scaling it one hundred times.

**Handoff:** The parts are viable and the sensing physics works. Return to the roadmap at its first stop: the schematic.

## 4. From schematic to working PCB — slides 20–30

**Section question:** How does a software-minded builder turn validated components into hardware that can survive first contact with reality?

**Narrative movement:** The schematic records electrical intent, then KiCad turns it into a physical layout. Assembly planning, outside review, and Gerber inspection happen before the order; measurement and rework happen after it.

20. **KiCad in 30 Seconds: Schematic**
   Show the real MT9102ET sensor and SN74LV4051A multiplexer circuit. Symbols and nets capture what connects to what without yet deciding where anything sits.

21. **KiCad in 30 Seconds: PCB**
   Turn logic into a 447.04 × 162.81 mm, two-layer board. Define the outline, place one hundred switch and Hall footprints, route copper, and verify the physical rules.

22. **For Tiny Parts, Buy the Assembled Board**
   Contrast strategic hand assembly with automated SMT. Design for the factory, verify BOM and placement data, and hand-install only the unsupported exceptions.

23. **Find Your People**
   Show how specific measurements made the phantom-key and rail-sag problem answerable by the Embedded Engineering, Daisy Seed, and Keyboard Atelier communities. Communities become reviewers when the question contains evidence.

24. **Before “Order,” Invite Someone to Disagree**
   Combine ERC/DRC, human design review, and AI-generated questions. Automated checks find broken rules; people challenge broken assumptions. Every review comment still needs evidence.

25. **KiCad in 30 Seconds: Gerbers**
   Plot manufacturing layers and drills, inspect the fabricator’s upload preview, confirm the order revision, and make the reviewed design into a $44.90 physical commitment.

26. **Interruption: So It Works, Right?**
   Let Mio voice the software assumption that green checks plus successful fabrication equal a working board. Reveal the distinction: “No. It exists. Now we measure it.”

27. **The PCB Arrived; Bring the Toolbelt**
   Introduce the layered diagnostic kit: multimeter, logic analyzer, oscilloscope, soldering iron, debug probe, and bench helpers. The method is observe, hypothesize, change one thing, and measure again.

28. **A Bad Trace Is Not a Dead Board**
   Use the actual project bodges to explain a safe trace repair: locate endpoints, isolate incorrect copper, prepare attachment points, bridge and anchor, then verify before powered testing.

29. **Remove the Part, Not the Pads**
   Open with “Omae wa mou… desoldered” / “Nani?!” over U1, then explain removal by package and thermal mass. Heat every joint, lift without force, clean and inspect the pads, then align pin one and install the replacement.

30. **You Can Add the Component You Forgot**
   Classify the change as across two nodes, in series, or complex enough for a small adapter board. Verify ratings and node names, anchor the patch, and document the bodge as the specification for revision B.

**Handoff:** Fabrication did not finish the design; it produced evidence. Now the corporate developer gets the familiar-looking part—software—with one important twist: the repository is part of the circuit.

## 5. From board to key event — slides 31–42

**Section question:** How does embedded firmware turn one hundred noisy analog channels into reliable musical intent every millisecond?

**Narrative movement:** The firmware first describes its hardware target, then creates a one-way real-time pipeline. Calibration, filtering, state, queues, mappings, and observability each own one kind of uncertainty.

31. **Interruption: Finally, Software**
   Ask how the code knows what hardware exists. Answer that the build describes the board before `main` runs.

32. **The Binary Knows the Board Before `main`**
   Connect the ARM target, linker memory map, probe configuration, `no_std`, and RTIC runtime to the actual STM32H750. The first embedded contract is agreement among MCU, memory, probe, and repository.

33. **One-Way Flow, Explicit Responsibilities**
   Introduce the implemented pipeline: 1 kHz scan → mux reads → four-sample average → switch state machine → fixed queue → MIDI UART. Each stage has a narrow responsibility.

34. **One Millisecond, One Hundred Keys**
   Explain the topology: eight broadcast mux addresses, nine direct ADC reads, four decoder-selected reads, and 104 available slots covering 100 populated sensors.

35. **Priorities Are Part of the Instrument**
   Compare the hard-deadline scan, audio DMA, soft-deadline MIDI routing, and best-effort OLED. Real-time means bounded and predictable, not merely fast.

36. **Every Key Needs Its Own Zero**
   Calibrate every sensor independently, prime its filter, and allow its idle baseline to drift only slowly and within a clamp. Nothing may be pressed while the firmware learns “rest.”

37. **Four Samples Become One Stable Position**
   Show the constant-time rolling average. Four samples tame noise at the cost of roughly 1.5 ms mean sample age; longer filters would blur the threshold timing used for velocity.

38. **Two Thresholds, One NoteOn**
   Turn position into an event. Three confirmations beyond the first threshold save `t1`; three beyond the second compute velocity and emit exactly one NoteOn. A separate release threshold provides hysteresis and eventually emits NoteOff.

39. **MIDI Is Slower Than the Scan Deadline**
   Calculate that a three-byte DIN MIDI NoteOn consumes about 0.96 ms on the wire. The scan therefore queues intent at priority 15 while a priority-2 task performs blocking UART writes.

40. **Tables Separate Copper from Music**
   Split physical truth, musical policy, and transport. `SWITCH_MAP` describes wiring, `SWITCH_TO_NOTE` describes pitch, and event routing chooses melody, controls, drums, and channels.

41. **Build One Trustworthy Key Before One Hundred**
   Give a reusable implementation order: prove fixed MIDI output, log one sensor, emit one reliable NoteOn/NoteOff pair, then scale mapping, queueing, and deadline tests.

42. **Observability Is a Hardware Feature**
   Trace evidence at every boundary: raw ADC, filtered value, semantic event, queue, UART bytes, and sound. Use RTT, GDB, LEDs, OLED status, MIDI monitors, debug headers, and test points to identify which layer is lying.

**Handoff:** The keyboard can now measure a performance and produce bytes. That still does not explain where sound comes from.

## 6. From event to MIDI cable — slides 43–47

**Section question:** What exactly crosses the boundary between the keyboard and the synthesizer?

**Narrative movement:** MIDI becomes a clean system boundary. The keyboard sends semantic performance instructions; the receiver owns waveform generation and audio.

43. **Interruption: Where Is the Sound?**
   Ask the obvious question: if the firmware only produced bytes, where is the audio? Answer that the keyboard is a controller and the synthesizer makes the sound.

44. **MIDI Is Instructions, Not Audio**
   Decode `90 3C 64` as NoteOn, middle C, velocity 100 on channel 1. Introduce 16 logical channels and the recurring 0–127 range.

45. **One Cable Carries a Whole Performance**
   Expand the vocabulary to Note On/Off, Control Change, Program Change, and Pitch Bend. Show the default split between melody on channel 1 and drums on channel 10.

46. **USART1 Becomes a MIDI Port**
   Configure an ordinary UART for 31,250 baud, 8-N-1; assign Daisy pins D13 and D14; and let `MidiSender` give those transmitted bytes MIDI meaning.

47. **Follow One Press from Intent to DIN**
   Trace switch 0 at velocity 100 through threshold crossing, queue, note table, octave setting, channel selection, and UART serialization to bytes `90 36 64`. The scan owns time; the MIDI task owns the wire.

**Handoff:** The note table is not arbitrary. Its numbers preserve a musical geometry that began on a completely different instrument.

## 7. From key grid to instrument — slides 48–51

**Section question:** How can a staggered Model M become a coherent musical interface rather than a pile of note buttons?

**Narrative movement:** The Wicki–Hayden layout moves from concertina hardware into a firmware table. The instrument preserves interval relationships, so musical shapes can move without changing.

48. **One Note Geometry, Two Instruments**
   Introduce the Wicki–Hayden history from Kaspar Wicki to Brian Hayden. The project borrows the note relationships, not the concertina’s physical board, and encodes them in `SWITCH_TO_NOTE`.

49. **The Interval Is a Vector**
   Define isomorphic layout: the same geometric movement yields the same musical interval wherever it begins. Rows move by whole steps; adjacent playable rows in the firmware are offset by a perfect fourth.

50. **Pianist vs. Isomorphic Layout**
   Use the manga reaction to dramatize the learning cost. Piano muscle memory rejects the missing black keys and diagonals, then “Masaka…” marks the realization that every key reuses the same shape.

51. **Guitarists Get It**
   Compare the layout with movable shapes on a fretboard. The point is not a user-research claim; it is a familiar analogy for invariant interval patterns.

**Handoff:** The prototype now works as both an engineered system and an instrument. The final interruption asks whether that makes it a product.

## 8. Prototype, demo, and finale — slides 52–58

**Section question:** What remains after the prototype works?

**Narrative movement:** Productization explodes the tidy prototype story into supply, safety, production, support, compliance, and business problems. The live performance then proves what the prototype can already do. The original Mark Rober quest remains unresolved, but the project has delivered the deeper lesson.

52. **Interruption: Can We Sell It?**
   Let the corporate developer translate the prototype into “shareholder value,” then ask the real question: can this become a product?

53. **Production Reality**
   Begin with Ren confidently presenting an orderly grid, then bury him and the product decision under the growing list. His final “Yamete kudasai—please stop adding requirements” lands with the overload. A prototype proves possibility, not manufacturability or margin.

54. **Live Demo**
   Play the Wicki–Hayden note field, demonstrate velocity, use bend and vibrato, turn the pots, show the OLED, trigger drums and special keys, and finish by routing DIN MIDI to the external instrument. If the hardware fails, switch immediately to the captioned backup video.

55. **Quest Objective: Meet Mark Rober**
   Return to the objective card and reveal the honest status: still loading. This preserves the serial-adventure framing instead of forcing a false victory.

56. **Closing**
   Land the thesis in one sentence: “The best way to stretch your software brain is to build something where the bugs are physical.” Thank the audience and invite questions or direct them to the instrument.

57. **See Our Last Demo**
   Leave the Synthphone-e demo and ElectroNuck channel QR codes on screen as post-close resources rather than interrupting the opening narrative.

58. **Photo Credits**
   Hold the attribution page after the spoken close. It is a credits screen, not another content beat.

## The complete argument in seven sentences

1. We chose an unreasonable object because the quest demanded something memorable.
2. A Model M click cannot express velocity, so we had to measure motion instead of merely detecting a press.
3. Open designs, KiCad, careful part selection, measurement, community review, and rework turned the idea into physical evidence.
4. Real-time firmware turned noisy position samples into exactly one musical event without missing its scan deadline.
5. MIDI gave us a boundary where the keyboard could describe a performance and leave sound generation to another system.
6. Wicki–Hayden geometry turned the computer-key grid into an instrument with reusable interval shapes.
7. The prototype did not finish the quest or become a product, but it proved the larger point: physical constraints make software ideas tangible.
