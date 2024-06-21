import { queryResultToDataNode } from "../src/lib/database"

describe("query result processor", () => {
  it("rejects query results not containing 1 row", () => {
    expect(() => queryResultToDataNode([])).toThrow()
    expect(() =>
      queryResultToDataNode([undefined, undefined, undefined])
    ).toThrow()
  })

  it("converts a query result to a data node", () => {
    type DataNode = { one: string; two: string }
    expect(
      queryResultToDataNode<DataNode>([
        {
          columns: ["one", "two"],
          values: [
            ["oneValue", "twoValue"],
            ["oneValue1", "twoValue1"],
          ],
        },
      ])
    ).toStrictEqual([
      { one: "oneValue", two: "twoValue" },
      { one: "oneValue1", two: "twoValue1" },
    ])
  })
})
