---
layout: post
title: "DFS: recursiveDescription"
---

If you've studied Computer Science or for technical interviews one of the many things to learn was [graph traversal](https://en.wikipedia.org/wiki/Graph_traversal).

It comes in two flavors: [Depth First Search (DFS)](https://en.wikipedia.org/wiki/Depth-first_search) and [Breadth First Search (BFS)](https://en.wikipedia.org/wiki/Breadth-first_search) and thay have lots of applications.
I realized I've been using a possible DFS application this whole time with UIView's private method: `recursiveDescription`. I'll attempt to re-create it with this assumption.

<!--break-->
<!-- Adding a double break as the (##) header breaks formatting  ¯\_(ツ)_/¯ -->
<!--break-->

## Assumptions

I'm going to assume you're familiar with Swift and iOS development.
I'll do my best to ensure I explain each line thoroughly but please reach out if I should expand on anything.

If you're familiar with graphs (specifically adjacency lists) and DFS then feel free to skip the next section.
Otherwise, I'm going to do a brief recap of Adjacency Lists and Depth First Search.

Note: I'm not affiliated with Ray Wenderlich but they have some great tutorials that cover both: [Adjacency Lists](https://www.raywenderlich.com/152046/swift-algorithm-club-graphs-adjacency-list) and [Depth First Search](https://www.raywenderlich.com/157949/swift-algorithm-club-depth-first-search) in great detail.

## Brief Recap 

### Adjacency Lists

Let's get started then by looking at the below graph.

*Figure 1. Directed Graph*
<img src="/assets/img/posts/20171210/directed_graph.png" width="50%" height="50%">

This is a **directed** graph that consists of six (6) **vertices** and five (5) **edges**.
- **Vertices** (a.k.a nodes or points) are the encircled data.
  - Ex. The below graph has vertices: `A`, `B`, `C`. `D`, `E`, `F`, and `G`.
- **Edges** (a.k.a. arcs or lines) are the lines that connect each vertex. 
  - Ex. `A` has two edges associated with it: one to `B` and another to `C`.
- **Directed** indicates that the edges have a direction associated with them. 
  - Ex. If we started at `A`, we could go to `B` or `C` but we could not do the reverse (UNLESS we had an edge connecting one of these back to `A` but that's out of scope of this post)

An [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) is a collection of neighbouring vertices relative
to a given vertex. For example, We would say that vertex `B` and vertex `C` are adjacent to vertex `A`.
For the graph above, these are the vertices and their adjacent vertices:

*Table 1. Vertex and Adjacent Vertices*

| Vertex | Adjacency List |
|:------:|:---------------|
|    A   | [ B, C ]       |
|    B   | [ D, E ]       |
|    C   | [ F ]          |
|    D   | [ ]            |
|    E   | [ ]            |
|    F   | [ ]            |

### Depth First Search

DFS is a traversal algorithm that starts at the root (top most vertex) and exhaust all the branches of one neighbour before repeating for the next neighbour.

In our graph above, we would do the following steps following this algorithm:

*Figure 2. DFS Visualization*
<img src="/assets/img/posts/20171210/dfs_visualization.gif" width="50%" height="50%">

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

You're probably itching to see some code so here is an example of how DFS could be implemented in Swift.

There are two things to highlight with the below [recursive](https://en.wikipedia.org/wiki/Recursion_(computer_science)) implementation of DFS:
- We're not searching for anything here instead we're printing each time a vertex is visited
- It is possible for a vertex to point back to its parent vertex directly or indirectly.
  - This is commonly seen in [undirected graphs](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)#Undirected_graph) but possible in both. It requires we keep track of vertices we've visited.

{% highlight swift %}
// 1
func depthFirstSearch(from root: Vertex?) {
    // 2
    guard let root = root else {
        return
    }

    // 3
    root.visited = true
    // 4
    print(root.value + "\n")

    // 5
    for adjacentVertex in root.adjacent {
        // 6
        if !adjacentVertex.visited {
            // 7
            depthFirstSearch(from: adjacentVertex)
        }
    }
}
{% endhighlight %}

1. Defines a function that takes in one parameter `root` of type `Vertex`.
  - The `?` denotes that this is a `Vertex` that can possibly be nil. This is called an [Optional Type](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Types.html#//apple_ref/doc/uid/TP40014097-CH31-ID452) in Swift.
  - The `from` is a named parameter and helps the name read like a sentence: `depthFirstSearch(from: someRootVertex)`
2. Guard asserts that root is not nil and be unwrapped to a non-nil instance.
  - In Swift, it's common to unwrap optional variables as a test to see if they're nil or not.
3. Mark the root as visited so we don't accidentally visit it again
4. Print the value of the root which is the data type associated with the vertex followed by a new line.
5. This is a classic `for each` loop. We iterate through all the root's adjacent vertices naming each as `adjacentVertex`
6. We check if we've visited the `adjacentVertex` before and if we have then do nothing
7. Otherwise, call `depthFirstSearch(from:)` again passing in the current `adjacentVertex` as the new root and repeat.

The output would then look something like this: 
```
A
B
D
E
C
F
```

## UIView `description`

If you've ever had to debug a view then at one point you've probably printed out its `description` at least once before.

If not, [description](https://developer.apple.com/documentation/objectivec/nsobject/1418799-description) is a method and property that exists on all `NSObject`s (base class for Objective-C classes) that returns a string representation of the object's contents. This is similar to `__str__`/`__repr__` in Python.

This output is often used for debugging purposes and can used as follows:

{% highlight swift %}
let view = UIView()
print(view.description)
{% endhighlight %}

The output would be a string representation similar to the below. 

```
<UIView: 0x7fecf2106100; frame = (0 0; 0 0); layer = <CALayer: 0x600000028500>>
```
Note that some of these values might be different on your machine
as these are instance specific but they should be similar.

You can even override the description for your own NSObject subclasses:

{% highlight swift %}
final class Tutorial: NSObject {
    let title: String
    let date: Date

    init(title: String, date: Date) {
        self.title = title
        self.date = date
    }

    override var description: String {
        return "<Tutorial: \(title); date: \(date);>"
    }
}
{% endhighlight %}

For a pure Swift class (no base class) or struct, you can achieve this via protocols such [CustomStringConvertible](https://developer.apple.com/documentation/swift/customstringconvertible) and [CustomDebugStringConvertible](https://developer.apple.com/documentation/swift/customdebugstringconvertible) to name a few.

These protocols could be used as follows:

{% highlight swift %}
struct Tutorial: CustomStringConvertible {
    var title: String
    var date: Date

    // MARK: CustomStringConvertible
    var description: String {
        return "<Tutorial: \(title); date: \(date);>"
    }
}
{% endhighlight %}

## UIView `recursiveDescription`
 
**What if we had a view hierarchy that we wanted to view more information about? How would that description look like?**

Well, that is where the private method on UIView: `recursiveDescription` comes in handy. Apple was even kind enough to leave a little note about its usage [here](https://developer.apple.com/library/content/technotes/tn2239/_index.html#//apple_ref/doc/uid/DTS40010638-CH1-SUBSECTION34).

`recursiveDescription` works by printing out the description of the view and all its subviews. Subviews are children of a parent view. A typical iOS app consists of many views and associated subviews.

Printing `recursiveDescription` is one of those things that is easier in Objective-C but we can still do this in Swift. We just have to do some [extra steps](https://stackoverflow.com/a/27694502/1631577) to get it to work. The below example will use a quick and dirty way.

Please note that this is a private API and should **NOT** be shipped in production code. Your app is likely get rejected from the App Store. However, for debugging purposes it should be fine to use.

*Snippet 1. View Hierarchy*

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

1. This sets up a `UIScrollView` and adds two labels: `label1` and `label2` as subviews.
2. This sets up a `UITableView` and adds a single `UImageView` as a subview.
3. This sets up a `UIView` and adds the scroll view and table view from above as subviews.
4. Since we're dealing with a private method, we can't just call `view.recursiveDescription` as this won't compile. 
  - Instead we must call this method directly via `performSelector`. This lets us call an arbitrary method on an object. 
  - This is not recommended as it'll crash if the object does not implement the method.

The output should look something like this:

```
// [...] is on purpose since this'll be too long otherwise
<UIView: 0x7fcf29812970; [...]> // view
   | <UIScrollView: 0x7fcf2901b800; [...]> // scrollView
   |    | <UILabel: 0x7fcf29808710; [...]> // label1
   |    | <UILabel: 0x7fcf26e021d0; [...]> // label2
   | <UITableView: 0x7fcf2903f200; [...]> // tableView
   |    | <UIImageView: 0x7fcf29810f80; [...]> // imageView
```

Given the output above, it looks like the following is happening:

```
1. Vist view
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

If the above look familiar to you then you're noticing something very important. These steps are essentially the same as the steps outlined in the "Depth First Search" section traversal.

### Reverse engineering `recursiveDescription`

It'll help to first simplify what we want to print out in our `recursiveDescription`. 

We'll change the previous output to ignore the spaces around the pipes (`|`):

```
<UIView: 0x7fcf29812970; [...]>
|<UIScrollView: 0x7fcf2901b800; [...]>
||<UILabel: 0x7fcf29808710; [...]>
||<UILabel: 0x7fcf26e021d0; [...]>
|<UITableView: 0x7fcf2903f200; [...]>
||<UIImageView: 0x7fcf29810f80; [...]>
```

You'll notice that the relationship between the view hierarchies looks just like a graph!

*Figure 3. UIView heirarchy graph*

<img src="/assets/img/posts/20171210/subview_graph.png" width="60%" height="60%">

Given we know the end result and the relationship. We can try to first solve this for the simplest case: just one UIView as a root `view`.

If we only have one view in the heirarchy then all we need to do is just print out the view's description.

*Snippet 2. recursiveDescription implementation*

{% highlight swift %}
extension UIView {
    func recursiveDescription() -> String {
        // 1
        guard !subviews.isEmpty else {
            return description
        }

        // Do nothing for now...
    }
}
{% endhighlight %}

1. If the view has no subviews then we just return the description of the view.

Thus, if we called something like this:

{% highlight swift %}
let view = UIView()
print(view.recursiveDescription())
{% endhighlight %}

we could expect an ouput like the below. However, that isn't very exciting, is it?

```
<UIView: 0x7fcf29812970; [...]>
```

Back to the heirarchy in Snippet 1 we know we need to be able to print the subviews descriptions of the view in addition to the starting view.

We need some way of navigating to the neighbour views (vertices) and we can do that via the property [subviews](https://developer.apple.com/documentation/uikit/uiview/1622614-subviews). This property returns an array of the immediate descendants of a given view. This should remind you of an adjacency list.

*Table 2. View and Subviews from Snippet 1*

|     UIView    |           Subviews         |
|:-------------:|:---------------------------|
|     view      | [ scrollView, tableView ]  |
|   scrollView  | [ label1, label2 ]         |
|   tableView   | [ imageview ]              |
|    label1     | [ ]                        |
|    label2     | [ ]                        |
|   imageView   | [ ]                        |

With the ability to get subviews in hand, we can add to "Snippet 2" in a manner similar to a tradition DFS implementation:

*Snippet 3. recursiveDescriptionHelper implementation*

{% highlight swift %}
func recursiveDescription() -> String {
    guard !subviews.isEmpty else {
        return description
    }

    // 1
    var text: String = description
    // 2
    for subview in subviews {
        // 3
        text += subview.recursiveDescription()
    }

    // 4
    return text
}
{% endhighlight %}

1. Initializes a local variable `text` with the description of the current view we're at.
2. Iterates through each of the views in `subviews` denoting each as `subview` (singular).
3. Appends the results of calling `recursiveDescription()` on each `subview` to `text`.
  - Since a view cannot have its parent as a subview, we don't need to check if we've visited this view already.
  - However, a typical DFS implementation will perform this check.
4. Returns the final version `text` to be used by the caller.

This will yield us a result that looks very similar to below:

```
<UIView: 0x7fa2db70ebe0; [...]><UIScrollView: 0x7fa2de80d000; [...]><UILabel: 0x7fa2db400b60; [...]><UILabel: 0x7fa2db706520; [...]><UITableView: 0x7fa2dd047c00; [...]><UIImageView: 0x7fa2db70d1e0; frame = (0 0; 0 0); [...]>
```

What happened? It looks like we forgot to add new lines after each print.

Let's replace our line that appends each `subview.recursiveDescription()` to have a prefixed new-line character (`\n`).

{% highlight swift %}
func recursiveDescription() -> String {
    ...
    for subview in subviews {
        text += "\n"
        text += subview.recursiveDescription()
    }
    ...
}
{% endhighlight %}

The output now looks like below which is much better but there is no indication of heirarchy level.

```
<UIView: 0x7fa2db70ebe0; [...]>
<UIScrollView: 0x7fa2de80d000; [...]>
<UILabel: 0x7fa2db400b60; [...]>
<UILabel: 0x7fa2db706520; [...]>
<UITableView: 0x7fa2dd047c00; [...]>
<UIImageView: 0x7fa2db70d1e0; [...]>
```

The next question then becomes: **how do we indicate what level we're on and how do we get those pipes to display?**

The great thing about recursive functions is that since we're repeatedly calling ourselves, we can pass down data via function parameters.

Given this knowledge, we could pass a `"prefix"` parameter at each level that indicates what to prepend before each output.

For example:
- In level 1, we have a `prefix` of `""`
- In level 2, we have a `prefix` of `"|"`
- In level 3, we have a `prefix` of `"||"`
- In level n, we have a prefix of `"||...||"` (`"|"` repeated n-1 times)

However, since the original implementation of `recursiveDescription` takes no parameters, we'll need to create a helper function to perform the recursive nature of this function. We'll call it `recursiveDescriptionHelper` and it'll take a single `prefix` parameter of type `String`.

{% highlight swift %}
func recursiveDescription() -> String {
    return recursiveDescriptionHelper(withPrefix: "")
}

func recursiveDescriptionHelper(withPrefix prefix: String) -> String {
    guard !subviews.isEmpty else {
        return description
    }

    var text: String = description
    for subview in subviews {
        // 1
        let nextPrefix = prefix + "|"
        text += "\n"
        // 2
        text += nextPrefix
        // 3
        text += subview.recursiveDescriptionHelper(withPrefix: nextPrefix)
    }

    return text
}
{% endhighlight %}

1. Appends another pipe to the `prefix` everytime we go down a level (or enter another view's subviews loop)
2. We'll append the `nextPrefix` to the text prior to appending the view's `recursiveDescription`
3. Call `recursiveDescriptionHelper` and pass in the updated `nextPrefix` to use for the next level

Afterwards, we should expected to see an output like the following which is exactly what we wanted!

```
<UIView: 0x7fa2db70ebe0; [...]>
|<UIScrollView: 0x7fa2de80d000; [...]>
||<UILabel: 0x7fa2db400b60; [...]>
||<UILabel: 0x7fa2db706520; [...]>
|<UITableView: 0x7fa2dd047c00; [...]>
||<UIImageView: 0x7fa2db70d1e0; [...]>
```

Although, this doesn't technically match what the real `recursiveDescription` does I do hope it provided some insight into how you would go about implementing something like this on your own.

I'll leave three exercises to the reader:
- Match the output of the real implementation
- Allow a user to indicate how deep in the heirarchy they wish to traverse and;
- Determine the time and space complexity of this traversal

## Final Notes

It's often hard sometimes to see where the things you're studying get applied in real life.

I hoped this helped inspire you to keep a look out for where some of these famous algorithms may pop-up and maybe a thing or two about iOS and Swift.
Let me know if you have any suggestions or questions about this, I'd really appreciate the feedback.
