
# to enable serialization when caching requests to the expensive api
def freeze(d):
    if isinstance(d, dict):
        return frozenset((key, freeze(value)) for key, value in d.items())
    elif isinstance(d, list):
        return tuple(freeze(value) for value in d)
    return d


def unfreeze(f):
    if isinstance(f, frozenset):
        d = dict(f)
        for k, v in d.items():
            d[k] = unfreeze(v)
        return d
    elif isinstance(f, tuple):
        return [unfreeze(value) for value in f]
    return f
