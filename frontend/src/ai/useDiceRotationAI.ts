// import { NeuralNetwork } from "brain.js"
// import { INeuralNetworkData } from "brain.js/dist/src/neural-network"
// import { useEffect, useState } from "react"
// import useFetch from "../components/hooks/useFetch"

// type InputType = { x: number; y: number; z: number }

// type DataType = {
//   input: InputType
//   output: [number]
// }[]

const useDiceRotationAI = () => {
  //   const [net, setNet] =
  //     useState<NeuralNetwork<INeuralNetworkData, INeuralNetworkData>>()
  //   useEffect(() => {
  //     const config = {
  //       binaryThresh: 0.5,
  //       hiddenLayers: [3, 4, 5, 6], // array of ints for the sizes of the hidden layers in the network
  //       activation: "sigmoid", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  //       leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
  //     }
  //     const n = new NeuralNetwork(config)
  //     setNet(n)
  //   }, [])
  //   const { data: trainingData, fetchData } = useFetch("/api/ai/dice/")
  //   /**
  //    * Trains the model
  //    */
  //   const train = async () => {
  //     await fetchData()
  //     const data: DataType = trainingData
  //     const normalizedTrainingData: DataType = []
  //     // Normalizing the x, y, z. Their values are between -pi and pi.
  //     // Also normalizing the output which is between 1 and 6.
  //     for (let i = 0; i < data.length; i++) {
  //       const entry = data[i]
  //       const input = {
  //         x: entry.input.x / (2 * Math.PI) + 0.5,
  //         y: entry.input.y / (2 * Math.PI) + 0.5,
  //         z: entry.input.z / (2 * Math.PI) + 0.5,
  //       }
  //       const output = (entry.output[0] - 1) / 5
  //       normalizedTrainingData[i] = {
  //         input,
  //         output: [output],
  //       }
  //     }
  //     // Training the network based on those normalized valeus
  //     net?.train(normalizedTrainingData)
  //   }
  //   /**
  //    * Runs the model, given some input
  //    */
  //   const run = async (input: InputType) => {
  //     if (!net) return 0
  //     await train()
  //     const output = net.run(input)
  //     const num = Number(output.toString())
  //     // Un-normalizing? Is that a word?
  //     return Math.round(5 * num + 1)
  //   }
  //   return { run }
}

// // prettier-ignore
// // const data = [
// //   // 1
// //   { input: {x: 3.1256305108327114, y: -1.5100878856031257, z: 3.125425625711317}, output: [1/6] },
// //   { input: {x: 0.0015918107667124964, y: 0.9168181096386551, z: -0.0014976553076640048}, output: [1/6] },
// //   { input: {x: 3.13804536278938, y: 1.2943213940467202, z: -3.138414345918242}, output: [1/6] },
// //   { input: {x: 3.12742003833601, y: 1.5024147409600717, z: -3.1276875251313054}, output: [1/6] },

// //   // 6
// //   { input: {x: 3.140433369281573, y: 0.3143679093589594, z: 0.0006222094766355095}, output: [6/6] },
// //   { input: {x: 0.0011179750282526919, y: 0.16692008339263928, z: -3.1415144481399584}, output: [6/6] },
// //   { input: {x: 3.1353754603318778, y: -1.392534909366675, z: -0.005855192785914245}, output: [6/6] },
// //   { input: {x: 2.453168729756934, y: -1.5690479799581099, z:-0.6881431960179334}, output: [6/6] },

// //   // 2
// //   { input: {x: 3.1403126538063306, y: 0.5320433465144419, z: 1.5711823081418979}, output: [2/6] },
// //   { input: {x: 3.1404660421625574, y: 0.20427773506826932, z: 1.5707617934648705}, output: [2/6] },
// //   { input: {x: 3.140486805853115, y: -0.06674640218556249, z: 1.5704594270892702}, output: [2/6] },
// //   { input: {x: 0.0013081795188059772, y: -0.567392941764316, z: -1.5703564510510226}, output: [2/6] },
// //   { input: {x: 0.0017853684741958307, y: -0.9048315317342623, z: -1.5696554910671952}, output: [2/6] },
// //   { input: {x: 3.140484184061273, y: 0.09948869613606177, z: 1.5706431331915094}, output: [2/6] },
// //   { input: {x: 0.0011051515743079237, y: -0.05958328548483913, z: -1.570993595813825}, output: [2/6] },
// //   { input: {x: 0.0017257501292551579, y: -0.8772986271071589, z: -1.5697319242888867}, output: [2/6] },
// //   { input: {x: 3.1404301988223713, y: -0.320732062342795, z: 1.5701664825955897}, output: [2/6] },
// //   { input: {x: 3.1404847398618454, y: -0.09350602269198391, z: 1.570430075477538}, output: [2/6] },
// //   { input: {x: 0.18727401917531472, y: -1.5648715445307704, z: -1.3837890503153107}, output: [2/6] },
// //   { input: {x: 3.1374698936136816, y: -1.2998401004739195, z: 1.5665605838453622}, output: [2/6] },
// //   { input: {x: 0.0029257167302414637, y: 1.1842025837212056, z: -1.573769529445494}, output: [2/6] },
// //   { input: {x: 0.0026408800993509775, y: -1.1397790045308973, z: -1.5686599726719834}, output: [2/6] },
// //   { input: {x: 3.1402575212512303, y: 0.5982204406165584, z: 1.5712851317372114}, output: [2/6] },
// //   { input: {x: -2.9642883553647095, y: 0.8726196882380701, z: 1.572705373788906}, output: [2/6] },
// //   { input: {x: 0.4016211959205549, y: -1.5672929167887004, z: -1.1693900473058703}, output: [2/6] },
// // ]

export default useDiceRotationAI
