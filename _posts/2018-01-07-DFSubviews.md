---
layout: post
title: 'DFSubviews: DFS and UIKit'
excerpt_separator: <!--break-->
---

There are two popular traversal algorithms for [graph traversal](https://en.wikipedia.org/wiki/Graph_traversal): [Depth First Search (DFS)](https://en.wikipedia.org/wiki/Depth-first_search) and [Breadth First Search (BFS)](https://en.wikipedia.org/wiki/Breadth-first_search). Both of which have lots of [applications](https://en.wikipedia.org/wiki/Graph_traversal#Applications).

I believe that UIView's private function: `recursiveDescription` is an application of DFS and I'll attempt to re-create it with that assumption.

<!--break-->

## Assumptions

I'm going to assume you're familiar with:
- how the [view hierarchy](https://developer.apple.com/library/content/documentation/General/Conceptual/Devpedia-CocoaApp/View%20Hierarchy.html) works in iOS; and
- Swift but it's not necessary assuming you're familiar with another language
    - There are some Swift only features that I'll do my best to explain.

I'm going to walk through a brief recap on Graphs, Adjacency Lists, and DFS. Afterwards, I'll use this as the foundation for reverse engineering `recursiveDescription`.

## Graphs 101

Let's first look at the following graph:

*Figure 1. Directed Graph*
<img src="/assets/img/posts/20180107/directed_graph.png" width="75%" height="75%">

This is a **directed** graph that consists of six (6) **vertices** and five (5) **edges**.
- **Vertices** (a.k.a nodes or points) are the encircled data
    - Ex. The above graph has vertices: `A`, `B`, `C`, `D`, `E`, and `F`
- **Edges** (a.k.a. arcs or lines) are the lines that connect each vertex
    - They can also have [weights](https://en.wikipedia.org/wiki/Glossary_of_graph_theory_terms#weight) associated with them
    - Ex. `A` has two edges associated with it: one to `B` and another to `C`
- **Directed** refers to the [orientation](https://en.wikipedia.org/wiki/Orientation_(graph_theory)) of the graph 
    - This specifically refers to **how** edges connect each vertex
    - A graph can either be [directed](https://en.wikipedia.org/wiki/Directed_graph) or [undirected](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)#Undirected_graph) (sometimes referred to as bidirectional)
    - Ex. If we started at `A`, we could go to `B` or `C` but we could not do the reverse

## Adjacency Lists

An [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) is a collection of neighbouring vertices relative to a given vertex. 

For the graph in Figure 1, We would say that vertex `B` and vertex `C` are adjacent to vertex `A`.

The rest of vertices and their adjacent vertices are outlined below:

| Vertex | Adjacency List |
|:------:|:---------------|
|    A   | [ B, C ]       |
|    B   | [ D, E ]       |
|    C   | [ F ]          |
|    D   | [ ]            |
|    E   | [ ]            |
|    F   | [ ]            |

## Depth First Search

DFS is a traversal algorithm that: **starts at the root (top most vertex) and exhaust all the branches of one neighbour before repeating for the next neighbour**.

Given the graph from Figure 1, we would do these steps following the algorithm:

```
1. Visit A
2. A has two neighbours: B and C
3. Visit B
4. B has two neighbours: D and E
5. Visit D
6. D has no neighbours so we've exhausted this branch
7. B has one more neighbour: E
8. Visit E
9. E has no neighbours so we've exhausted this branch
10. A has one more neighbour: C 
11. Visit C next
12. C has one neighbour: F
13. Visit F
14. F has no neighbours so we've exhausted this branch
```

This can be better visualized as:
<img src="/assets/img/posts/20180107/dfs_visualization.gif" width="75%" height="75%">


Let's look at how we could implement DFS in Swift. First, we need to model a single vertex. One way could look like:

{% highlight swift %}
// 1
class Vertex<T> {
    // 2
    let value: T
    var visited: Bool = false
    var adjacencyList: [Vertex] = []

    // 3
    init(value: T) {
        self.value = value
    }
}
{% endhighlight %}

1. A generic class definition for the vertex
    - The `T` denotes that this is generic and can be of any type (i.e. `Int`, `String`, etc)
2. The properties (or members) for the class
    - `value`: the generic data belonging to this vertex
    - `visited`: the flag with an initial value of `false` to indicate if we've seen this node before
    - `adjacencyList`: the array that represents neighbouring vertices
        - This is one of the many ways to represent an adjacency list
3. The initialization (or constructor) function
    - An example usage could look like: `Vertex<Int>(value: 2)` or `Vertex<String>(value: "Alex")`

Using this model, there are three things to highlight with the following implementation of DFS:
1. It's [recursive](https://en.wikipedia.org/wiki/Recursion_(computer_science))
2. We're not searching for anything here instead we're printing out a value each time a vertex is visited
3. It is possible for a vertex to point back to its parent vertex directly or indirectly
  - This is commonly seen in undirected graphs but possible in directed too
  - It requires we keep track of vertices we've visited otherwise we could potentially traverse infinitely

{% highlight swift %}
// 1
func depthFirstSearch(from vertex: Vertex) {
    // 2
    vertex.visited = true
    // 3
    print(vertex.value + "\n")

    // 4
    for adjacentVertex in vertex.adjacencyList {
        // 5
        if !adjacentVertex.visited {
            // 6
            depthFirstSearch(from: adjacentVertex)
        }
    }
}
{% endhighlight %}

1. Defines a function that takes in one parameter `vertex` of optional type `Vertex`
    - The `?` denotes this is an [optional type](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Types.html#//apple_ref/doc/uid/TP40014097-CH31-ID452) and means that this value could be nil 
    - The `from` is a named parameter and helps the function name read like a sentence: `depthFirstSearch(from: someRootVertex)`
2. Mark the `vertex` as visited so we don't accidentally visit it again
3. Print the `value` property of the `vertex` followed by a new line
4. We iterate through all the root's adjacent vertices denoting the iteration variable as `adjacentVertex`
5. We check if we haven't visited the `adjacentVertex` before doing anything
6. Continue the traversal by calling `depthFirstSearch(from:)` again and passing `adjacentVertex` as the new vertex

Steps `1.` to `6.` will repeat until we've exhausted all the vertices in the graph.
The output would look like this:
```
A
B
D
E
C
F
```

Another way we could implement DFS is using a stack but that's out of scope for this post.

## UIView `description`

Before we can look at `recursiveDescription` we need to first look at its counterpart `description`:

```swift
// Swift generated version of NSObject.h
var description: String { get }
```

[description](https://developer.apple.com/documentation/objectivec/nsobject/1418799-description) is a property that exists on all Objective-C classes that inherit from `NSObject`. This property returns a string representation of the object's contents. This is similar to `__str__`/`__repr__` in Python. 

If you ever had to debug something in iOS then you've likely called `description` directly or indirectly.
The way the description would typically be called is as follows:

{% highlight swift %}
let view = UIView(frame: CGRect(x: 0, y: 10, width: 100, height: 500))
print(view.description)
{% endhighlight %}

with the following output:

```
<UIView: 0x7fecf2106100; frame = (0 10; 100 500); layer = <CALayer: 0x600000028500>>
```

You can override the `description` function to provide a custom description message:

{% highlight swift %}
class Tutorial: NSObject {
    let title: String

    init(title: String) {
        self.title = title
    }

    /// This overrides the superclass description
    override var description: String {
        return "<Tutorial: \(title)>"
    }
}
{% endhighlight %}

The custom output would look like:
{% highlight swift %}
let tutorial = Tutorial(title: "This is a tutorial about Cats")
print(tutorial.description)
{% endhighlight %}

with the following output:

```
<Tutorial: "This is a tutorial about Cats">
```

For a pure Swift class (one that does not inherit from NSObject) or struct, you can achieve this via protocols such [CustomStringConvertible](https://developer.apple.com/documentation/swift/customstringconvertible) and [CustomDebugStringConvertible](https://developer.apple.com/documentation/swift/customdebugstringconvertible).

These protocols could be used as follows:

{% highlight swift %}
struct Tutorial: CustomStringConvertible {
    var title: String

    // MARK: CustomStringConvertible
    var description: String {
        return "<Tutorial: \(title)>"
    }
}
{% endhighlight %}

## UIView `recursiveDescription`

For a single view, `description` is often enough but what if you wanted to get information about its view hierarchy? That is where `recursiveDescription` comes in. 

`recursiveDescription` is a private function on UIView that prints the `description` of the view and all its subviews (or children views). 
However, using it is one of those things that's easier in Objective-C but still possible in Swift. We just have to do some [extra steps](https://stackoverflow.com/a/27694502/1631577) to get it to work.

*Please note that since this a private API it should **NOT** be shipped in production code. Your app is likely get rejected from the App Store. For debugging purposes though it should be fine.*

We're going to set up a simple view hierarchy in the below code snippet. 
This setup is heavily simplified and likely not how you would actually setup a UI since:
- We're not taking view layout into account; and 
- Some of these views such as `tableView` shouldn't have subviews added to them. 

{% highlight swift %}
// 1
let scrollView = UIScrollView()
let label1 = UILabel()
let label2 = UILabel()
scrollView.addSubview(label1)
scrollView.addSubview(label2)

// 2
let tableView = UITableView()
let imageView = UIImageView()
tableView.addSubview(imageView)

// 3
let view = UIView()
view.addSubview(scrollView)
view.addSubview(tableView)

// 4
print(view.perform("recursiveDescription"))
{% endhighlight %}

1. Creates a `UIScrollView` and adds two labels: `label1` and `label2` as subviews
2. Creates a `UITableView` and adds a single `UImageView` as a subview
3. Creates a `UIView` and adds the `scrollView` and `tableView` from above as subviews
4. Calls `recursiveDescription` on the `view` via the `perform()` function
    - Since this is a private function, we can't just call `view.recursiveDescription()` as it won't compile
    - Instead we call this function via `perform()`. This lets us call an arbitrary function on an object by its name
    - This approach to function calling is **not** recommended though as it'll crash if the object does not implement it

The output should look something like this minus the comments `//` and `[...]` which is used to truncate the output:

```
<UIView: 0x7fcf29812970; [...]> // view
   | <UIScrollView: 0x7fcf2901b800; [...]> // scrollView
   |    | <UILabel: 0x7fcf29808710; [...]> // label1
   |    | <UILabel: 0x7fcf26e021d0; [...]> // label2
   | <UITableView: 0x7fcf2903f200; [...]> // tableView
   |    | <UIImageView: 0x7fcf29810f80; [...]> // imageView
```

The above output shows each view description along with the description of its subviews indented to represent depth.

The indent is denoted with a pipe (`|`) and spaces. You can see that this matches our initial code: `view` is the parent of `scrollView` and `tableView` which are parents of their own subviews.

We can conclude from the above output that the following is happening:

```
1. Visit view
2. view has two subviews: scrollView and tableView
3. Visit scrollView
4. scrollView has two subviews: label1 and label2
5. Visit label1
6. label1 has no subviews so we've exhausted this view
7. scrollView has one more subview: label2
8. Visit label2
9. label2 has no subviews so we've exhausted this view
10. view has one more subview: tableView
11. Visit tableView
12. tableView has one subview: imageView
13. Visit imageView
14. imageView has no subviews so we've exhausted this view
```

If the above look familiar to you then you're noticing something very important. These steps follow the same algorithm as the steps in the "Depth First Search" traversal.

## Reverse engineering `recursiveDescription`

It looks like `recursiveDescription` is using DFS to print out its hierarchy but how can we confirm this without looking at the source code?

Our only option is to attempt to reverse engineer the function. 
Since we don't know how it works we have to treat the function as a black box. We can observe what the output is for varying inputs.

Additionally, it'll help to simplify what we want to print out in our version of `recursiveDescription`. 
We'll change the previous output to ignore the spaces around the pipes (`|`):

```
<UIView: 0x7fcf29812970; [...]>
|<UIScrollView: 0x7fcf2901b800; [...]>
||<UILabel: 0x7fcf29808710; [...]>
||<UILabel: 0x7fcf26e021d0; [...]>
|<UITableView: 0x7fcf2903f200; [...]>
||<UIImageView: 0x7fcf29810f80; [...]>
```

Since the output represents a hierarchy, you might notice it can be represented similar to the graph in Figure 1 as:

*Figure 2. UIView hierarchy graph*

<img src="/assets/img/posts/20180107/subview_graph.png" width="75%" height="75%">

### Trivial View Hierarchy

Let's try to solve the simple case: a hierarchy consisting of a single UIView.
If we only have one view then we just need to print out its description.

{% highlight swift %}
// 1
extension UIView {
    // 2
    func recursiveDescription() -> String {
        // 3
        return description
    }
}
{% endhighlight %}

1. Create an extension so we can add our `recursiveDescription` function to UIView
    - An `extension` lets you add functions to an existing class
    - This is especially useful when you don't have access to the class internals
2. Defines a function called `recursiveDescription` that takes no parameters and returns a `String`
3. Return the `description` of the view

Let's test out what happens when we print the `recursiveDescription` for a single view using our implementation:

{% highlight swift %}
let view = UIView()
print(view.recursiveDescription())
{% endhighlight %}

The output should look like:

```
<UIView: 0x7fcf29812970; [...]>
```

However, that isn't very exciting, is it? If we have a more complex hierarchy then it'll only ever print the parent view.

We have be able to print the parent view's `description` along with all of the subview `description`s.

### Non-Trivial View Hierarchy

We now need a way of iterating through the subviews of a view and we can do that via the UIView property `subviews`. This property returns an array of the immediate subviews for a given view. 

```swift
// Swift generated version of UIView.h
var subviews: [UIView] { get }
```

This should remind you of an adjacency list and we can also model the view hierarchy similarly:

*Table 2. View and Subviews from Snippet 1*

|     UIView    |           Subviews         |
|:-------------:|:---------------------------|
|     view      | [ scrollView, tableView ]  |
|   scrollView  | [ label1, label2 ]         |
|   tableView   | [ imageview ]              |
|    label1     | [ ]                        |
|    label2     | [ ]                        |
|   imageView   | [ ]                        |

With the ability to get subviews we can update our original `recursiveDescription` implementation to match a traditional DFS implementation as follows:

{% highlight swift %}
// The extension UIView code is present but omitted for simplicity
func recursiveDescription() -> String {
    // 1
    guard !subviews.isEmpty else {
        return description
    }

    // 2
    var text: String = description
    // 3
    for view in subviews {
        // 4
        text.append(view.recursiveDescription())
    }

    // 5
    return text
}
{% endhighlight %}

1. Assert that this view has subviews by checking if its subviews array is empty
    - `guard` is a Swift feature that acts like an assertion. If the assertion fails then it enters the `else` block
2. Initializes a local variable `text` with the description of the current view we're at
3. Iterates through each of the views in `subviews` denoting each as `view` (singular)
4. Appends the results of calling `recursiveDescription()` on each `view` to `text`
  - Since a view cannot have its parent as a subview, we don't need to check if we've visited it already
5. Returns the final version `text` to be used by the caller

This will yield us a result that looks very similar to:

```
<UIView: 0x7fa2db70ebe0; [...]><UIScrollView: 0x7fa2de80d000; [...]><UILabel: 0x7fa2db400b60; [...]><UILabel: 0x7fa2db706520; [...]><UITableView: 0x7fa2dd047c00; [...]><UIImageView: 0x7fa2db70d1e0; frame = (0 0; 0 0); [...]>
```

What happened? It looks like we forgot to add new lines after each print.

Let's replace our line that appends each `subview.recursiveDescription()` to have a prefixed new-line character (`\n`).

{% highlight swift %}
// The extension UIView code is present but omitted for simplicity
func recursiveDescription() -> String {
    ...
    for view in subviews {
        // 1
        text.append("\n")
        text.append(view.recursiveDescription())
    }
    ...
}
{% endhighlight %}

1. This appends a newline character (`\n`) to the text prior to appending the recursiveDescription of the `view`

The output now looks like:

```
<UIView: 0x7fa2db70ebe0; [...]>
<UIScrollView: 0x7fa2de80d000; [...]>
<UILabel: 0x7fa2db400b60; [...]>
<UILabel: 0x7fa2db706520; [...]>
<UITableView: 0x7fa2dd047c00; [...]>
<UIImageView: 0x7fa2db70d1e0; [...]>
```

This is better but there is no indentation representing hierarchy depth.

### Expanding `recursiveDescription`

How do we indicate what level we're on and how do we get those pipes (`|`) to display?
Since we're recursively calling our function we can pass down data through a function parameter.

We could extend our function to include a `"prefix"` parameter and at each level we'll pass down what to prepend before each output.

For example:
- In level 1, `prefix` is `""`
- In level 2, `prefix` is `"|"`
- In level 3, `prefix` is `"||"`
- In level 4, `prefix` is `"|||"`
- In level n, `prefix` is `"||...||"` (`"|"` repeated n-1 times)

However, since the original implementation of `recursiveDescription` takes no parameters, we'll need to create a helper function to handle the `prefix` passing and recursive nature of this function. 

We'll call it `recursiveDescriptionHelper` and it'll take a single `prefix` parameter of type `String`:

{% highlight swift %}
// The extension UIView code is present but omitted for simplicity
func recursiveDescription() -> String {
    return recursiveDescriptionHelper(with: "")
}

func recursiveDescriptionHelper(with prefix: String) -> String {
    guard !subviews.isEmpty else {
        return description
    }

    var text: String = description
    // 1
    let nextPrefix: String = prefix + "|"
    for view in subviews {
        text.append("\n")
        // 2
        text.append(nextPrefix)
        // 3
        text.append(view.recursiveDescriptionHelper(with: nextPrefix))
    }

    return text
}
{% endhighlight %}

1. Append a pipe (`|`) to the `prefix` parameter and store it in the local variable `nextPrefix`
2. We'll append the `nextPrefix` to the text prior to appending the view's `recursiveDescription`
3. Call `recursiveDescriptionHelper` and pass in the `nextPrefix` to use for the next recursive call
    - Recall the recursive calls will stop once the view has no more subviews

Afterwards, we should expect to see an output like:

```
<UIView: 0x7fa2db70ebe0; [...]>
|<UIScrollView: 0x7fa2de80d000; [...]>
||<UILabel: 0x7fa2db400b60; [...]>
||<UILabel: 0x7fa2db706520; [...]>
|<UITableView: 0x7fa2dd047c00; [...]>
||<UIImageView: 0x7fa2db70d1e0; [...]>
```

This matches the expected output of our version of `recursiveDescription` but it doesn't technically match what the real `recursiveDescription` does. 

Hopefully, you see how DFS could have been used for the real implementation and how we can expand on it from here.
I've put the final version together for you in this [playground](https://github.com/ajfigueroa/blog-code/tree/master/posts/1-DFSubviews.playground).

## Conclusion

In this post, we looked at DFS and how a potential application exists in the function `recursiveDescription`.
We also briefly touched on how to reverse engineer a function by treating it as a black box. 

I hoped this helped inspire you to look out for some of these famous algorithms in your day to day life.
It really helps make the concept stick if you can see a practical application for it. 

Let me know if you have any suggestions or questions, I'd really appreciate the feedback.

## Additional Resources

- [Adjacency Lists](https://www.raywenderlich.com/152046/swift-algorithm-club-graphs-adjacency-list) and
- [Depth First Search](https://www.raywenderlich.com/157949/swift-algorithm-club-depth-first-search) in great detail.
- A [blurb](https://developer.apple.com/library/content/technotes/tn2239/_index.html#//apple_ref/doc/uid/DTS40010638-CH1-SUBSECTION34) in Apple documentation about `recursiveDescription` usage.
