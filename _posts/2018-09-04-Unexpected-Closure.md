---
layout: post
title: 'Unexpected Closure'
excerpt_separator: <!--break-->
categories: Blog
---

Closures in Swift are a great feature and are useful for tasks such as: network callbacks, notification subscribing, and providing an alternative to the delegate pattern.

Recently, I discovered that code as inconspicuous as a `&&` (and) conditional could also leverage this feature.

<!--break-->

Let's assume that we are modelling a `User` of a global subscription-based application where users can customize their theme color.
We could represent this in Swift as a struct that has properties for its: identifier, subscription status, country code, and theme color.
The resulting `User` model could look like this:
```swift
struct User {
    var id: String
    var isSubscribed: Bool
    var themeColor: UIColor?
    var countryCode: String
}
```

We'll make the `themeColor` optional here since it'll be up to the User if they want to customize this.

Assume that our application already had an object to represent a theme unsurprisingly called `Theme`:

```swift
class Theme {
    let backgroundColor: UIColor

    init(backgroundColor: UIColor?) {
        self.backgroundColor = backgroundColor ?? .white
    }
}
```

Observe that this `init` will fallback to `UIColor.white` (or `.white`) if the `backgroundColor` property is **not** provided.

Given this knowledge, we could create a new class just for the custom User theme.
The custom theme would need to be initialized with a User so that we could grab its `themeColor`. This would then get passed to the parent class as its `backgroundColor`.

The custom User theme object could be represented below as a `Theme` subclass:
```swift
class UserTheme: Theme {
    let user: User

    init(user: User) {
        self.user = user
        super.init(themeUser.themeColor)
    }
}
```

However, what if we learn that custom User theming is a feature that should only be available to subscription Users. Additionally, it should only be limited to Canadian users.

We could then update our `UserTheme` class to handle these cases as follows:
```swift
class UserTheme: Theme {
    let user: User

    init(user: User) {
        self.user = user
        var themeColor: UIColor?
        if self.user.isSubscribed && self.user.countryCode == "CA" {
            themeColor = self.user.themeColor
        }

        super.init(backgroundColor: themeColor)
    }
}
```

Although this looks alright, it'll actually fail to compile. You'll see the following error log in Xcode:
```
error: 'self' captured by a closure before all members were initialized
        if self.user.isSubscribed && self.user.countryCode == "CA" {
                                     ^
```

This error message while informative is a bit confusing. What closure is it referencing?

We could easily fix by removing the explicit `self` and instead rely on the `user` property passed in as a parameter. This fixes the symptom and not the root cause which is that there is an implicit closure in this line of code?

After posting this error message to the [tacow](https://www.meetup.com/tacow-org/) Slack group, [@rydermackay](https://twitter.com/rydermackay) pointed out to me that the Swift language is capturing the right-hand side of the conditional in a closure.

That is, given the conditional: `LHS && RHS` (LHS and RHS represent Left-Hand Side and Right-Hand Side respectively). `RHS` is being wrapped in a closure. More specifically, it is being wrapped in an `autoclosure` so that it could lazily evaluate the right condition if the left condition was false.

This could be verified by looking at the source code for the [&& operator](https://github.com/apple/swift/blob/7f105e4e3a994e6ac87860d5bd7bf9942c52b4bb/stdlib/public/core/Bool.swift#L289):
```swift
public static func && (lhs: Bool, rhs: @autoclosure () throws -> Bool) rethrows -> Bool {
    return lhs ? try rhs() : false
}
```

In order to understand the warning a little better, we need to know what an `autoclosure` is.

From the Apple documentation, an `autoclosure`:

> ...is a closure that is automatically created to wrap an expression that’s being passed as an argument to a function. It doesn’t take any arguments, and when it’s called, it returns the value of the expression that’s wrapped inside of it.

but most importantly:

> An autoclosure lets you delay evaluation because the code inside isn’t run until you call the closure. Delaying evaluation is useful for code that has side effects or is computationally expensive because it lets you control when that code is evaluated.


That means that the above `&&` implementation at a high level is equivalent to the following. Note: We can't actually write `&&` without the `rhs` since it's defined to have both parameters.

```swift
// For simplicity, I've removed all throws
public static func && (lhs: Bool, rhs: () -> Bool) -> Bool {
    return lhs ?? rhs()
}

// Example: Assume A and B are some boolean conditions
A && { () -> Bool in
    return B
}
```

If we update our previous example with the high level interpretation, it would look like this

```swift
class UserTheme: Theme {
    let user: User

    init(user: User) {
        self.user = user
        var themeColor: UIColor?
        let result = self.user.isSubscribed && { () -> Bool in
            return self.user.countryCode == "CA"
        }
        if result {
            themeColor = self.user.themeColor
        }

        super.init(backgroundColor: themeColor)
    }
}
```

As you can see, the `self.user.countryCode == "CA"` is indeed being captured by a block and since we're doing this before `super.init()` when all members are initialized the compilation fails.

There are a few ways to fix this, we could:
- move all this offending code to below the `super.init()`
- store the result of the right-hand side expression in a separate variable, or;
- we could move the creation of Themes to a [factory](https://en.wikipedia.org/wiki/Factory_method_pattern) class to avoid a `Theme` subclass

Either way, these all work but in general you should typically avoid referencing `self` before the `super.init()` in cases like these.
I hope you learned something and potentially got you interested in looking at more implementation details of the Swift programming language.

The sample code can be found [here](https://github.com/ajfigueroa/blog-code/tree/master/posts/3-Unexpected-Closure.playground).

## Additional Resouces

- [Autoclosure Documentation](https://docs.swift.org/swift-book/LanguageGuide/Closures.html#ID543)
- [Hipster Swift post by KrakenDev](https://krakendev.io/blog/hipster-swift#autoclosure)
- [Swift Repo](https://github.com/apple/swift)
